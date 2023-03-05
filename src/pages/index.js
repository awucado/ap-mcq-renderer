import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <h1>Welcome to the Quiz App</h1>
      <Link href="/quiz">
        Start Quiz
      </Link>
    </div>
  )
}
