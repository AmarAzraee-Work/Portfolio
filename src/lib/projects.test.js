import { sortProjects } from './projects'

describe('sortProjects', () => {
  it('puts featured projects first and keeps the original order otherwise', () => {
    const list = [
      { title: 'a', featured: false },
      { title: 'b', featured: true },
      { title: 'c', featured: false },
      { title: 'd', featured: true },
    ]
    expect(sortProjects(list).map((p) => p.title)).toEqual(['b', 'd', 'a', 'c'])
  })

  it('does not mutate the input array', () => {
    const list = [{ title: 'a', featured: false }, { title: 'b', featured: true }]
    sortProjects(list)
    expect(list.map((p) => p.title)).toEqual(['a', 'b'])
  })
})
