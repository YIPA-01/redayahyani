import { Card } from '@/components/Card'
import { Section } from '@/components/Section'
import { SimpleLayout } from '@/components/SimpleLayout'

function ToolsSection({
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof Section>) {
  return (
    <Section {...props}>
      <ul role="list" className="space-y-16">
        {children}
      </ul>
    </Section>
  )
}

function Tool({
  title,
  href,
  children,
}: {
  title: string
  href?: string
  children: React.ReactNode
}) {
  return (
    <Card as="li">
      <Card.Title as="h3" href={href}>
        {title}
      </Card.Title>
      <Card.Description>{children}</Card.Description>
    </Card>
  )
}

export const metadata = {
  title: 'Uses',
  description: 'Software I use, gadgets I love, and other things I recommend.',
}

export default function Uses() {
  return (
    <SimpleLayout
      title="Software I use, gadgets I love, and other things I recommend."
      intro="I get asked a lot about the things I use to build software, stay productive, or buy to fool myself into thinking I’m being productive when I’m really just procrastinating. Here’s a big list of all of my favorite stuff."
    >
      <div className="space-y-20">
        <ToolsSection title="Workstation">
          <Tool title="13” MacBook Air, M1, 8GB RAM (2021)">
            On the go machine for me. To upgrade to the M2 Max in the future.
          </Tool>
        </ToolsSection>

        <ToolsSection title="Development tools">
          <Tool title="Cursor">
            IDE for coding.
          </Tool>
          <Tool title="Claude Code">
            AI-powered code editor.
          </Tool>
          <Tool title="Postman">
            API testing tool.
          </Tool>
        </ToolsSection>

        <ToolsSection title="DevOps tools">
          <Tool title="Docker">
            Docker is a tool designed to make it easier to create, deploy, and run applications by using containers. Containers allow a developer to package up an application with all of its dependencies so the application can be run anywhere.
          </Tool>
          <Tool title="Kubernetes">
            Kubernetes is an open-source system for automating deployment, scaling, and management of containerized applications.
          </Tool>
        </ToolsSection>

        <ToolsSection title="Cloud tools">
          <Tool title="AWS">
            AWS is a cloud platform that provides a range of services for building and scaling web and mobile applications.
          </Tool>
          <Tool title="Vercel">
            Vercel is a cloud platform for static sites and serverless functions that allows you to deploy your projects to the cloud.
          </Tool>
          <Tool title="Cloudflare">
            Cloudflare is a cloud platform that provides a range of services for building and scaling web and mobile applications.
          </Tool>
          <Tool title="DigitalOcean">
            DigitalOcean is a cloud platform that provides a range of services for building and scaling web and mobile applications.
          </Tool>
        </ToolsSection>

        <ToolsSection title="AI tools">
          <Tool title="Claude">
            Claude is an AI agent that allows you to create and manage your projects.
          </Tool>
        </ToolsSection>

        <ToolsSection title="Database & Backend tools">
          <Tool title="Railway">
            Railway is a cloud platform that provides a range of services for building and scaling web and mobile applications.
          </Tool>
          <Tool title="Supabase">
            Supabase is an open-source backend as a service platform that provides a suite of tools for building and scaling web and mobile applications.
          </Tool>
          <Tool title="Firestore">
            FireStore is a NoSQL database that provides a range of services for building and scaling web and mobile applications.
          </Tool>
          <Tool title="MongoDB">
            MongoDB is a NoSQL database that provides a range of services for building and scaling web and mobile applications.
          </Tool>
          <Tool title="PostgreSQL">
            PostgreSQL is a relational database that provides a range of services for building and scaling web and mobile applications.
          </Tool>
          <Tool title="MySQL">
            MySQL is a relational database that provides a range of services for building and scaling web and mobile applications.
          </Tool>
          <Tool title="SQLite">
            SQLite is a relational database that provides a range of services for building and scaling web and mobile applications.
          </Tool>
        </ToolsSection>

        <ToolsSection title="Productivity">
        <Tool title="Notion">
          Note-taking tool.
          </Tool>
          <Tool title="Excalidraw">
            Excalidraw is a whiteboard tool that allows you to create diagrams, flowcharts, and other visualizations.
          </Tool>
        </ToolsSection>
      </div>
    </SimpleLayout>
  )
}
