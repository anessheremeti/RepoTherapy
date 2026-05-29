import axios from 'axios'

const github = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Accept: 'application/vnd.github+json',
    ...(process.env.GITHUB_TOKEN && {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    }),
  },
})

export async function fetchProfileData(username) {
  const [userRes, reposRes] = await Promise.all([
    github.get(`/users/${username}`),
    github.get(`/users/${username}/repos?sort=updated&per_page=30&type=public`),
  ])

  const repos = reposRes.data
  const topRepos = repos
    .filter(r => !r.fork)
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 6)

  const languageResults = await Promise.all(
    topRepos.map(repo =>
      github
        .get(`/repos/${username}/${repo.name}/languages`)
        .catch(() => ({ data: {} }))
    )
  )

  const topLanguages = {}
  languageResults.forEach(({ data }) => {
    Object.entries(data).forEach(([lang, bytes]) => {
      topLanguages[lang] = (topLanguages[lang] || 0) + bytes
    })
  })

  return {
    user: userRes.data,
    repos,
    topLanguages,
  }
}
