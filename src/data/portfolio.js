export const profile = {
  name: 'Swetha',
  heroLine1: 'I build automations that answer your decision-making questions',
  heroLine2: 'with just a click.',
  sub: 'Program manager + builder. I collaborate across Ops/Eng/IT/InfoSec/Product to ship agentic AI, dashboards, and process optimization workflows with measurable KPIs.',
  // theme-aware classnames for the subtitle
  subStyle: {
    light: 'text-slate-900', // high-contrast on light bg
    dark:  'text-white'      // high-contrast on dark bg
  }
}
export const metrics = { hoursSaved: 3200, npsLift: 7, licenseSavingsUSD: 186000, roiPercent: 164 }
export const projects = [
  { id:'wf-agentic-ai', company:'Whatfix', title:'Agentic AI Copilot', oneLiner:'Cited answers + next steps; 25–35% deflection', badge:'#a5b4fc',
    problem:'CSMs pinged Ops despite docs in Drive/Confluence; answers were slow and inconsistent.',
    approach:['RAG with citations','Confidence gate + “open ticket”','One-click actions (task/email/sheet)'],
    collab:['DBA (pgvector)','IT (Drive scopes)','SecOps','Ops (policy owners)'],
    metrics:{ hours:'20h/day', nps:5 }, impact:'Faster, consistent decisions; better renewal hygiene.',
    stack:['FastAPI','LangGraph','pgvector','GDrive/Sheets','Gmail'] },
  { id:'wf-quote-portal', company:'Whatfix', title:'Retool Quote Portal', oneLiner:'Cut back-and-forth; save CPQ licenses', badge:'#f0abfc',
    problem:'CSM quote changes required CPQ access + Ops email loops.', approach:['Structured intake','Validation rules','Single approved quote with Ops'],
    collab:['CS Ops','Procurement','Legal'], metrics:{ cycle:50, license:'$66k–$156k/yr' }, impact:'Less tooling thrash, clearer approvals, real license savings.',
    stack:['Retool','Sheets/Jira','SSO'] },
  { id:'o9-cvp-analytics', company:'o9 Solutions', title:'Unified C-/VP Analytics', oneLiner:'One version of truth; quicker decisions', badge:'#93c5fd',
    problem:'Leaders saw conflicting KPIs across decks and tools; decision latency and debate over “whose numbers”.', approach:['KPI dictionary + governance','Exec dashboards + mailer','Usage/time-to-insight metrics'],
    collab:['RevOps','IT','Leadership'], metrics:{ hours:'26h/wk', nps:4 }, impact:'Reduced meeting time spent aligning on numbers.',
    stack:['o9','GSheets/Slides','Python ETL'] },
  { id:'o9-prospect-bot', company:'o9 Solutions', title:'Prospect Research Bot', oneLiner:'45→10 min per account; richer SDR prep', badge:'#fde68a',
    problem:'SDRs spent 30–45 minutes synthesizing open-web info per account.', approach:['Scrape sources','Summarize 1-pagers','Push key points to CRM'],
    collab:['SDR Lead','Sales Ops'], metrics:{ hours:'175h/mo' }, impact:'Higher coverage and better tailored outreach.',
    stack:['Scrapy','Python','LLM'] },
]
