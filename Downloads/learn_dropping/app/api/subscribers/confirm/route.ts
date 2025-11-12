import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const token = url.searchParams.get('token')
    if (!token) return NextResponse.json({ error: 'Missing token' }, { status: 400 })

    const file = path.join(process.cwd(), 'data', 'subscribers.json')
    const raw = await fs.promises.readFile(file, { encoding: 'utf8' }).catch(() => '[]')
    const list = JSON.parse(raw || '[]') as any[]

    const idx = list.findIndex(s => s && s.confirmToken === token)
    if (idx === -1) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 404 })
    }

    list[idx].status = 'active'
    list[idx].confirmed_at = new Date().toISOString()
    delete list[idx].confirmToken

    await fs.promises.writeFile(file, JSON.stringify(list, null, 2), { encoding: 'utf8' })

    // Redirect to a friendly confirmation page in the app if available
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
    return NextResponse.redirect(`${appUrl.replace(/\/$/, '')}/subscribe/confirmation`)
  } catch (err) {
    console.error('Error confirming subscriber:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
