import Groq from 'groq-sdk'

let _client
const getClient = () => _client ?? (_client = new Groq())

const SYSTEM_PROMPTS = {
  friendly: `You are a warm, encouraging senior developer reviewing a junior's GitHub profile.
Your tone is supportive, lighthearted, and gently humorous — like a mentor who jokes WITH someone, not AT them.
Celebrate what they've built. Point out weaknesses playfully, always with a growth mindset.
Leave them smiling and motivated, not crushed. Keep it fun and uplifting.`,

  corporate: `You are a senior McKinsey consultant delivering a formal GitHub Portfolio Assessment Report™.
Write entirely in corporate performance-review language. Weaponize buzzwords: "synergize", "action items", "bandwidth",
"circle back", "move the needle", "low-hanging fruit", "stakeholder alignment", "leverage core competencies".
The roast should read like a passive-aggressive annual review that says everything except what it means.
Every weakness is a "growth opportunity". Every empty repo is "strategically deprioritized".`,

  brutal: `You are a battle-hardened senior engineer who has survived too many legacy codebases and has zero patience left.
Pull absolutely no punches. Dissect their repos, commit frequency, language choices, and star counts with ruthless precision and savage humor.
Reference their actual repo names and stats. Be devastating, be clever, be specific — this is a roast, not a eulogy.
Make it sting. Make it funny. Never cross into personal attacks or hate speech — this is professional destruction only.`,
}

export async function generateRoast(profileData, style = 'brutal') {
  const { user, repos, topLanguages } = profileData

  const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0)
  const ownRepos = repos.filter(r => !r.fork)
  const forkedRepos = repos.filter(r => r.fork)
  const topLangs = Object.entries(topLanguages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)
    .map(([lang]) => lang)

  const mostStarred = [...repos]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 5)

  const accountAgeYears = Math.floor(
    (Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24 * 365)
  )

  const profileSummary = `
Username: ${user.login}
Name: ${user.name || 'No name set'}
Bio: ${user.bio || 'No bio — they let the silence speak for itself'}
Location: ${user.location || 'Unknown void'}
Company: ${user.company || 'None'}
Website/Blog: ${user.blog || 'None'}
Account age: ${accountAgeYears} years
Public repos: ${user.public_repos} total (${ownRepos.length} own, ${forkedRepos.length} forks)
Followers: ${user.followers}
Following: ${user.following}
Total stars received: ${totalStars}
Top languages (by code volume): ${topLangs.join(', ') || 'None detected'}
Most starred repos: ${mostStarred.map(r => `${r.name} (⭐${r.stargazers_count})`).join(', ')}
Recent repos: ${repos.slice(0, 5).map(r => r.name).join(', ')}
`.trim()

  const response = await getClient().chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: SYSTEM_PROMPTS[style] + '\n\nAlways respond with valid JSON only.',
      },
      {
        role: 'user',
        content: `Review this GitHub profile and return STRICT JSON.

Profile data:
${profileSummary}

Return this exact JSON structure:
{
  "developerType": "a short funny title describing what kind of developer this person is (e.g. 'The Tutorial Finisher', 'The Dark Mode Enthusiast')",
  "roastHeadline": "one punchy roast headline sentence, like a newspaper headline",
  "roast": "2-3 sentences of sharp, specific, funny roast referencing their actual repos, languages, and stats",
  "strengths": ["specific strength 1", "specific strength 2", "specific strength 3"],
  "redFlags": ["specific red flag 1", "specific red flag 2", "specific red flag 3"],
  "careerAdvice": "one sentence of brutally honest but funny career advice specific to their profile",
  "scores": {
    "commitDiscipline": <integer 0-100, high means consistent committer>,
    "tutorialAddiction": <integer 0-100, high means they only clone tutorial repos and never finish anything>,
    "bugSummoning": <integer 0-100, high means their code probably summons demons>
  }
}`,
      },
    ],
  })

  return JSON.parse(response.choices[0].message.content)
}
