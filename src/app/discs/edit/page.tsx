import { redirect } from 'next/navigation'
import { auth } from '@/app/api/auth/[...nextauth]/route'

export default async function EditPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const session = await auth()
  const isAdmin = session?.user?.role === 'ADMIN'

  if (!isAdmin) {
    redirect('/')
  }

  const id = searchParams.id
  if (id) {
    redirect(`/discs/${id}/edit`)
  }

  redirect('/discs/new')
}
