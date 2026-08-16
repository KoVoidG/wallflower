// src/features/integrations/components/brand-icons.tsx
import React from 'react';

interface IconProps {
  className?: string;
}

/** Official Linear sliced-circle logo matching exact brand mark */
export function LinearIcon({ className = 'size-4' }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" fill="currentColor" className={className}>
      <mask id="linear-brand-mask">
        <circle cx="50" cy="50" r="46" fill="white" />
        <g transform="rotate(45 50 50)">
          <rect x="-20" y="55" width="140" height="6" fill="black" />
          <rect x="-20" y="69" width="140" height="6" fill="black" />
          <rect x="-20" y="82" width="140" height="6" fill="black" />
        </g>
      </mask>
      <circle cx="50" cy="50" r="46" mask="url(#linear-brand-mask)" />
    </svg>
  );
}

/** Official Jira Software Atlassian 3-step pillar */
export function JiraIcon({ className = 'size-4' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M11.53 2c0 2.4-1.97 4.35-4.4 4.35H2.8v4.33h4.33c4.78 0 8.67-3.87 8.67-8.68H11.53zm0 5.87c0 2.4-1.97 4.35-4.4 4.35H2.8v4.33h4.33c4.78 0 8.67-3.87 8.67-8.68H11.53zm0 5.86c0 2.4-1.97 4.35-4.4 4.35H2.8V22.4h4.33c4.78 0 8.67-3.87 8.67-8.67H11.53z" />
    </svg>
  );
}

/** Official Notion 3D 'N' box */
export function NotionIcon({ className = 'size-4' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l11.378-.817c1.097-.093 1.284-.42 1.05-.886L18.066 1.48C17.693.92 16.946.64 16.013.71L2.73 1.737c-.77.07-.98.42-.653.91l2.382 1.561zm.886 3.197v14.475c0 .91.56 1.353 1.633 1.284l12.593-.747c1.12-.07 1.353-.677 1.353-1.493V6.447c0-.84-.373-1.213-1.307-1.144L6.698 6.097c-.98.07-1.353.443-1.353 1.308zm10.79 1.773c.42.327.42.793.42 1.47v8.005c-.373.187-.84.28-1.283.327-.723.07-1.12-.187-1.516-.77l-4.153-6.23v6.37c.373.326.373.793.373 1.47l-2.776.163c-.373-.327-.373-.794-.373-1.47V10.74c0-.7.21-1.073.91-1.12l2.962-.187 4.34 6.488v-5.69c-.373-.327-.373-.794-.373-1.47l2.466-.164z" />
    </svg>
  );
}

/** Official Asana 3-circle triad */
export function AsanaIcon({ className = 'size-4' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <circle cx="12" cy="7" r="4.2" />
      <circle cx="6.5" cy="16.5" r="4.2" />
      <circle cx="17.5" cy="16.5" r="4.2" />
    </svg>
  );
}

/** Official GitHub Invertocat */
export function GithubIcon({ className = 'size-4' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
    </svg>
  );
}

/** Official Trello 2-board cards */
export function TrelloIcon({ className = 'size-4' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19.5 2h-15A2.5 2.5 0 0 0 2 4.5v15A2.5 2.5 0 0 0 4.5 22h15a2.5 2.5 0 0 0 2.5-2.5v-15A2.5 2.5 0 0 0 19.5 2ZM10 14.5a1.5 1.5 0 0 1-1.5 1.5H5.5A1.5 1.5 0 0 1 4 14.5v-9A1.5 1.5 0 0 1 5.5 4h3A1.5 1.5 0 0 1 10 5.5v9Zm10-4a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 14 10.5v-5A1.5 1.5 0 0 1 15.5 4h3A1.5 1.5 0 0 1 20 5.5v5Z" />
    </svg>
  );
}

/** Official GitLab Tanuki Fox Head */
export function GitlabIcon({ className = 'size-4' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 21.42 8.13 9.52h7.74L12 21.42Z" fillOpacity="0.85" />
      <path d="m1.44 9.52 10.56 11.9V9.52H1.44Z" fillOpacity="0.65" />
      <path d="M22.56 9.52 12 21.42V9.52h10.56Z" fillOpacity="0.65" />
      <path d="M1.44 9.52h6.69L5.3 1.05a.73.73 0 0 0-1.38 0L1.44 9.52Z" />
      <path d="M22.56 9.52h-6.69l2.83-8.47a.73.73 0 0 1 1.38 0l2.48 8.47Z" />
    </svg>
  );
}

/** Official Zendesk 'Z' geometric blocks */
export function ZendeskIcon({ className = 'size-4' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.93V13h3.93c-.45 2.19-2.02 3.86-3.93 3.93zM7.07 11c.45-2.19 2.02-3.86 3.93-3.93V11H7.07zm3.93 2v3.93C8.81 16.86 7.24 15.19 7.07 13H11zm5.93-2H13V7.07c2.19.45 3.86 2.02 3.93 3.93z" />
    </svg>
  );
}

/** Official Salesforce Cloud */
export function SalesforceIcon({ className = 'size-4' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M10.02 4.28a5.2 5.2 0 0 1 4.54 2.66 4.7 4.7 0 0 1 4.24 2.7 4.14 4.14 0 0 1 3.2 4.04c0 2.29-1.85 4.14-4.14 4.14H6.14A4.14 4.14 0 0 1 2 13.68c0-1.99 1.41-3.65 3.3-4.04a5.2 5.2 0 0 1 4.72-5.36z" />
    </svg>
  );
}

/** Official Monday.com 3-element 'm' mark */
export function MondayIcon({ className = 'size-4' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <circle cx="4.2" cy="16.5" r="2.4" />
      <path d="M8.5 18.9h2.8c.8 0 1.4-.6 1.4-1.4v-4.6c0-.8-.6-1.4-1.4-1.4H8.5c-.8 0-1.4.6-1.4 1.4v4.6c0 .8.6 1.4 1.4 1.4Z" />
      <path d="M15.2 8.5c-2.4 0-4.3 1.9-4.3 4.3v6.1h3v-6.1c0-.7.6-1.3 1.3-1.3s1.3.6 1.3 1.3v6.1h3v-6.1c0-2.4-1.9-4.3-4.3-4.3Z" />
    </svg>
  );
}

/** Official HubSpot Connected Sprocket */
export function HubspotIcon({ className = 'size-4' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.8 8.4V6.2c.7-.3 1.2-1 1.2-1.8 0-1.1-.9-2-2-2s-2 .9-2 2c0 .8.5 1.5 1.2 1.8v2.2a6.4 6.4 0 0 0-3.3 1.9L8.4 8.5c.1-.3.2-.6.2-1 0-1.9-1.6-3.5-3.5-3.5S1.6 5.6 1.6 7.5s1.6 3.5 3.5 3.5c.6 0 1.2-.2 1.7-.5l5.5 1.8a6.36 6.36 0 0 0-.4 2.2c0 3.5 2.9 6.4 6.4 6.4s6.4-2.9 6.4-6.4c0-3.1-2.2-5.6-5.1-6.1zm-13.7.8c-.9 0-1.6-.7-1.6-1.6s.7-1.6 1.6-1.6 1.6.7 1.6 1.6-.7 1.6-1.6 1.6zm13.2 8.9c-2.3 0-4.2-1.9-4.2-4.2s1.9-4.2 4.2-4.2 4.2 1.9 4.2 4.2-1.9 4.2-4.2 4.2z" />
    </svg>
  );
}

/** Official Intercom Chat Messenger Smile */
export function IntercomIcon({ className = 'size-4' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H8l-4 4V6a2 2 0 0 1 2-2Zm3 5a1 1 0 0 0 0 2h10a1 1 0 1 0 0-2H7Zm0 4a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2H7Z" />
    </svg>
  );
}

/** Official Zapier Spark */
export function ZapierIcon({ className = 'size-4' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}

/** Official Make Interconnected Nodes */
export function MakeIcon({ className = 'size-4' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm-1.8 14.5L6.5 9.8l1.6-1 2.6 4.3 2.6-4.3 1.6 1-3.7 6.7h-1.4Z" />
    </svg>
  );
}

export const BRAND_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  linear: LinearIcon,
  jira: JiraIcon,
  notion: NotionIcon,
  asana: AsanaIcon,
  github: GithubIcon,
  trello: TrelloIcon,
  gitlab: GitlabIcon,
  zendesk: ZendeskIcon,
  salesforce: SalesforceIcon,
  monday: MondayIcon,
  hubspot: HubspotIcon,
  intercom: IntercomIcon,
  zapier: ZapierIcon,
  make: MakeIcon,
};
