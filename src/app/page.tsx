import { Suspense } from 'react'
import RecentDumps from '@/components/RecentDumps'
import NewsList from '@/components/NewsList'

export default function Home() {
  return (
    <div className="space-y-12">
      <section>
        <h2 className="text-2xl font-bold mb-6">Recent Dumps</h2>
        <Suspense fallback={<div>Loading recent dumps...</div>}>
          <RecentDumps />
        </Suspense>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Latest News</h2>
        <Suspense fallback={<div>Loading news...</div>}>
          <NewsList />
        </Suspense>
      </section>
    </div>
  )
}
