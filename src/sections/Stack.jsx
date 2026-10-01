import { stack } from '../data/stack'
import Section from '../components/Section'
import Tag from '../components/Tag'

export default function Stack() {
  return (
    <Section id="stack">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {stack.map((group) => (
          <div key={group.category}>
            <h3 className="font-mono text-sm text-heading">{group.category}</h3>
            <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-2">
              {group.items.map((item) => (
                <li key={item}>
                  <Tag>{item}</Tag>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  )
}
