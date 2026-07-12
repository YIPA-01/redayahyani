import { type Metadata } from 'next'

import { Card } from '@/components/Card'
import { Section } from '@/components/Section'
import { SimpleLayout } from '@/components/SimpleLayout'

function WritingSection({
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof Section>) {
  return (
    <Section {...props}>
      <div className="space-y-16">{children}</div>
    </Section>
  )
}

interface Poem {
  title: string
  body: string
}

function PoemEntry({ title, body }: Poem) {
  return (
    <Card as="article">
      <Card.Title as="h3">{title}</Card.Title>
      <p className="relative z-10 mt-4 whitespace-pre-line text-sm text-zinc-600 dark:text-zinc-400">
        {body}
      </p>
    </Card>
  )
}

const poems: Array<Poem> = [
  {
    title: 'Certainty of the Absurd',
    body: `A halt in the breath of man; 
    An ache so deep that sensation becomes an abstract concept of which he merely worships, a God of the Myths. 
    I state my words, while the essence of logic remains distant, for all I ought to know evaporated, 
    along with you …`,
  },
  {
    title: 'II',
    body: `It is said, before the oldest amongst us have set eyes on the misty skies, that in each of us lies a scoundrel, for even the virtuous remain vain. 
    
    I am sorry.

    My story has no personage, no Introduction nor end. Only A Twirl of concepts bundling to recreate none but man. For we is I, as I judge me, and you; 
    We, alone.`,
  },
  {
    title: 'III',
    body: `It is said that the writer often looses sight of the corners to come. For a phrase can only go so far before the dot imperatively forces itself on the writer.
I wonder of the corners we take, of the relations we make and of the despair we endure. Each of us a Poet, writing a story handed to us incomplete… I try to make sense of the verses of the old. Again here I read a story with no character, no debut… strangely though the title states my name. Now imperative is the dot, still the ink may change color, even the title may differ. Yet the dot always is, at the end.`,
  },
  {
    title: 'A Yearning',
    body: `Once a wise man, , A yearning,
To abolish our failures,
For we are born naked

Shame,
Befriended our soul,
Thus we spurned the old Gods

Now, all must Hail
The lone Dogma
Capital, Matter, and the successful Man

Amen`,
  },
  {
    title: 'Born to sin',
    body: `Man is mirror, Reflects ones mind
Wicked as the Dark
To see,  is to be seen.

Vanity comes at a price
The superficial, is to be judged …
Empty court.

The feeble, as the King
None is to be praised ;
All hail …For I am Both.

A Blade has no master
…No friend, nor Foe
Mere Beast, mere prey.

Thy soul is frail
Empty as the Pot
For cracks are older than clay.`,
  },
  {
    title: 'A Day',
    body: `A Day,
To never forgo
For I’ve strolled with an angel

I’ve hold hands with the Heavens above
I’ve kissed a spirit,
whence sin never unfolds

A white bird,
That never puts its wings to rest
Up, it glides with the clouds

A query ... often comes to mind
Why is she gazing at me ?
Why does she hold my palm?

Oblivious I remain,
Yet, one Truth,
Of which I’m certain …

My Angel,
My Beloved Bird,
For you …

I will vanquish,
I will chuckle,
I will Love

…

Till Days end .`,
  },
]

export const metadata: Metadata = {
  title: 'Writing',
  description: 'Poetry and other creative writing.',
}

export default function Writing() {
  return (
    <SimpleLayout
      title="Writing poetry and other creative writing."
      intro="A collection of poetry and creative writing."
    >
      <div className="space-y-20">
        <WritingSection title="Poetry">
          {poems.map((poem) => (
            <PoemEntry key={poem.title} {...poem} />
          ))}
        </WritingSection>
      </div>
    </SimpleLayout>
  )
}
