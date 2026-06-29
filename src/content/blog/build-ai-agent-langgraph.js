// BLOG ARTICLE schema (template for all /blog/* posts).
// Rendered by src/routes/BlogPost.jsx + RichBody. Answer-first, question H2s,
// tables, TL;DR, sourced claims. body is an array of typed blocks:
//   { type:'p', text }                      paragraph (may include inline <strong> via **bold**)
//   { type:'h2', text } / { type:'h3', text }
//   { type:'ul'|'ol', items:[...] }
//   { type:'table', headers:[...], rows:[[...]] }
//   { type:'callout', title?, text }        highlighted box (e.g. key takeaway)
//   { type:'quote', text, cite? }
//   { type:'code', code, lang? }
export default {
  slug: 'build-ai-agent-langgraph',
  title: 'How to Build an AI Agent with LangGraph (2026 Walkthrough)',
  description:
    'A practical, code-first walkthrough for building a production AI agent with LangGraph — state, nodes, edges, tools, memory, human-in-the-loop, and evals — from someone who ships them for clients.',
  date: '2026-06-26',
  updated: '2026-06-26',
  readingTime: '11 min',
  category: 'How-to',
  primaryQuery: 'how to build an ai agent with langgraph',

  tldr: [
    'LangGraph models an agent as a graph: a typed state object flows through nodes (work) connected by edges (control flow), including conditional and looping edges.',
    'The minimum viable agent is a state schema, a model node, a tool node, and a conditional edge that loops between them until the model stops calling tools.',
    'Production maturity comes from four additions: a checkpointer for memory, an interrupt for human-in-the-loop approval, structured error handling on tools, and an eval suite.',
    'Reach for LangGraph when you need explicit control over multi-step flow, persistence, and human gates — not for a single one-shot LLM call.',
  ],

  body: [
    { type: 'p', text: 'The short version: **you build a LangGraph agent by defining a typed state, writing nodes that read and update that state, and wiring them with edges — including a conditional edge that loops the model and its tools until the work is done.** Everything else (memory, human approval, evals) is a layer you add on top of that core graph. Below is the full walkthrough I use when building agents for clients, with runnable code.' },

    { type: 'h2', text: 'What is LangGraph, and why use it over a plain loop?' },
    { type: 'p', text: 'LangGraph is a low-level orchestration framework that represents an agent as a **stateful graph**. Instead of a hand-rolled `while` loop around an LLM, you declare nodes (units of work) and edges (how control moves between them). That structure buys you three things that matter in production: explicit, inspectable control flow; built-in persistence so an agent can pause and resume; and first-class support for pausing on a human approval gate. For a single one-shot prompt you do not need it — reach for LangGraph when the work is genuinely multi-step, stateful, or needs a human in the loop.' },
    { type: 'callout', title: 'Mental model', text: 'A LangGraph agent is just three things: a state object that flows through the graph, nodes that transform that state, and edges that decide where the state goes next. Master those and everything else is composition.' },

    { type: 'h2', text: 'What are the core building blocks?' },
    { type: 'p', text: 'Five concepts cover almost everything you will build:' },
    {
      type: 'table',
      headers: ['Concept', 'What it is', 'Why it matters'],
      rows: [
        ['State', 'A typed dict (often with reducers like `add_messages`) that flows through the graph', 'The single source of truth every node reads and writes'],
        ['Node', 'A function that takes state and returns a partial state update', 'Where the actual work happens — calling the model, running a tool'],
        ['Edge', 'A connection from one node to the next (fixed or conditional)', 'Encodes the control flow, including loops and branches'],
        ['Tool', 'A typed function the model can choose to call', 'Lets the agent take real actions against your systems'],
        ['Checkpointer', 'Persistence layer that saves state per thread', 'Gives the agent memory and the ability to pause/resume'],
      ],
    },

    { type: 'h2', text: 'How do you build a minimal working agent?' },
    { type: 'p', text: 'Here is a complete, correct agent loop: a model node that can call tools, a tool node, and a conditional edge that routes back to the model after each tool call until the model answers without calling a tool.' },
    {
      type: 'code',
      lang: 'python',
      code: "from typing import Annotated, TypedDict\nfrom langgraph.graph import StateGraph, START, END\nfrom langgraph.graph.message import add_messages\nfrom langgraph.prebuilt import ToolNode\nfrom langchain_anthropic import ChatAnthropic\nfrom langchain_core.tools import tool\n\n\nclass State(TypedDict):\n    messages: Annotated[list, add_messages]\n\n\n@tool\ndef get_order_status(order_id: str) -> str:\n    \"\"\"Look up the status of a customer order by its ID.\"\"\"\n    # Replace with a real lookup against your system.\n    return f\"Order {order_id}: shipped, arriving in 2 days.\"\n\n\ntools = [get_order_status]\nmodel = ChatAnthropic(model=\"claude-sonnet-4-5\").bind_tools(tools)\n\n\ndef call_model(state: State) -> dict:\n    return {\"messages\": [model.invoke(state[\"messages\"])]}\n\n\ndef should_continue(state: State) -> str:\n    last = state[\"messages\"][-1]\n    return \"tools\" if last.tool_calls else END\n\n\ngraph = StateGraph(State)\ngraph.add_node(\"model\", call_model)\ngraph.add_node(\"tools\", ToolNode(tools))\ngraph.add_edge(START, \"model\")\ngraph.add_conditional_edges(\"model\", should_continue, [\"tools\", END])\ngraph.add_edge(\"tools\", \"model\")\n\nagent = graph.compile()\n",
    },
    { type: 'p', text: 'The whole agent loop is the last block: `START` goes to the model; the model either finishes or routes to `tools`; tools route back to the model. That cycle is the agent. Note the `add_messages` reducer — it appends new messages instead of overwriting, which is what makes the conversation accumulate across turns.' },

    { type: 'h2', text: 'How do you add memory so the agent remembers a conversation?' },
    { type: 'p', text: 'Memory in LangGraph is persistence, not a vector store. You attach a **checkpointer** at compile time, then invoke with a `thread_id`. The graph automatically saves and restores state for that thread, so the agent picks up exactly where it left off across calls — and across process restarts if you use a database-backed checkpointer.' },
    {
      type: 'code',
      lang: 'python',
      code: "from langgraph.checkpoint.memory import MemorySaver\n\nagent = graph.compile(checkpointer=MemorySaver())\n\nconfig = {\"configurable\": {\"thread_id\": \"customer-123\"}}\nagent.invoke({\"messages\": [(\"user\", \"Where is order A19?\")]}, config)\n# A later call with the same thread_id still has the prior context:\nagent.invoke({\"messages\": [(\"user\", \"And the one before it?\")]}, config)\n",
    },
    { type: 'callout', title: 'In production', text: 'Swap `MemorySaver` (in-process, ephemeral) for a Postgres or SQLite checkpointer. Same API, but state survives restarts and scales across workers — which is what you actually need for a deployed agent.' },

    { type: 'h2', text: 'How do you add human-in-the-loop approval?' },
    { type: 'p', text: 'For any agent that takes a consequential action — refunds, sending email, writing to a system of record — you want a human to approve before it commits. LangGraph supports this with `interrupt`, which pauses the graph mid-node and surfaces a payload to your application. The human responds, and you resume the same thread with a `Command` carrying their decision.' },
    {
      type: 'code',
      lang: 'python',
      code: "from langgraph.types import interrupt, Command\n\n\ndef approve_refund(state: State) -> dict:\n    decision = interrupt({\n        \"action\": \"issue_refund\",\n        \"amount\": state[\"refund_amount\"],\n    })\n    if decision != \"approve\":\n        return {\"messages\": [(\"assistant\", \"Refund declined by reviewer.\")]}\n    return {\"messages\": [(\"assistant\", \"Refund issued.\")]}\n\n\n# The graph pauses at the interrupt; resume once a human decides:\nagent.invoke(Command(resume=\"approve\"), config)\n",
    },
    { type: 'p', text: 'Because the checkpointer has saved state, the pause can last seconds or days — the agent simply resumes when the approval arrives. This is the single highest-leverage reliability feature for customer-facing or money-moving agents.' },

    { type: 'h2', text: 'How do you make tools and the loop reliable?' },
    { type: 'p', text: 'Demos work; production agents fail on the unhappy path. A few practices that earn their keep:' },
    {
      type: 'ul',
      items: [
        '**Type your tool arguments** with clear docstrings — the model calls tools far more accurately when the schema is unambiguous.',
        '**Catch and return errors inside tools** instead of raising. A returned error string lets the model see what went wrong and retry or ask the user; an unhandled exception kills the run.',
        '**Cap the loop** with a recursion limit (set `recursion_limit` in the config) so a confused model cannot spin forever and run up the bill.',
        '**Validate side effects behind a human gate** for anything irreversible, using the interrupt pattern above.',
        '**Stream intermediate steps** to your UI so users see progress and you get observability for free.',
      ],
    },

    { type: 'h2', text: 'How do you evaluate the agent before shipping?' },
    { type: 'p', text: 'You cannot ship what you cannot measure. Build a small eval suite of representative scenarios — both happy paths and the messy edge cases your users will actually hit — and assert on outcomes, not exact wording. The point is to make changes safely: when you swap a model, tweak a prompt, or add a tool, the suite tells you in seconds whether you broke something instead of you re-testing by hand.' },
    {
      type: 'ol',
      items: [
        'Collect 15–30 real scenarios, including failure cases (bad input, missing data, tool errors).',
        'For each, define what a correct outcome looks like — a final-state assertion, a required tool call, or an LLM-as-judge rubric.',
        'Run the suite on every prompt or model change and track pass rate over time.',
        'Promote production failures into new eval cases so the suite hardens as the agent matures.',
      ],
    },
    { type: 'quote', text: 'The graph is the easy part. The budget and the reliability live in the edges, the error handling, and the evals.', cite: 'Saswat Mishra' },

    { type: 'h2', text: 'Putting it together: the build order I use' },
    { type: 'p', text: 'When I build a LangGraph agent for a client, I work in this order so each layer is verified before the next is added:' },
    {
      type: 'ol',
      items: [
        'Define the state schema and the single highest-value workflow — resist "automate everything".',
        'Wire the minimal model-and-tools loop and confirm it works on real data.',
        'Add a checkpointer for memory and a thread-per-user model.',
        'Add human-in-the-loop interrupts on any consequential action.',
        'Harden tools with typed args and error handling, and cap the loop.',
        'Stand up an eval suite, then iterate against it instead of by hand.',
      ],
    },
    { type: 'callout', title: 'Want this built for you?', text: 'This is exactly the work I do as a service — from a de-risking prototype on your real data to a production agent with memory, approval gates, and evals. If you would rather ship than learn the framework, book a free 30-minute scoping call and we will map the highest-value workflow first.' },
  ],

  faq: [
    { q: 'How do you build an AI agent with LangGraph?', a: 'Define a typed state object, write nodes that read and update that state (a model node and a tool node at minimum), and connect them with edges — including a conditional edge that loops between the model and its tools until the model answers without calling a tool. Then layer on a checkpointer for memory, interrupts for human approval, error-handled tools, and an eval suite for production readiness.' },
    { q: 'When should you use LangGraph instead of a simple LLM call or a prebuilt agent?', a: 'Use LangGraph when the work is genuinely multi-step, needs persistent state across calls, branches conditionally, or requires a human approval gate. For a single one-shot prompt or a stateless classification, a plain LLM call is simpler and cheaper. LangGraph earns its complexity when you need explicit, inspectable control over the flow.' },
    { q: 'How does memory work in a LangGraph agent?', a: 'Memory is persistence, not a vector database. You attach a checkpointer at compile time and invoke the graph with a thread_id; LangGraph automatically saves and restores the full state for that thread between calls. Use the in-process MemorySaver for development and a Postgres or SQLite checkpointer in production so state survives restarts and scales across workers.' },
  ],

  related: {
    service: 'ai-agents',
    articles: ['langgraph-vs-crewai-vs-autogen', 'why-ai-agents-fail'],
    caseStudies: ['b2b-lead-engine'],
  },
};
