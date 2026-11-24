// SKV138 TEST: push display worker. Subscription and server delivery are not enabled yet.
self.addEventListener('push', event => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch { return; }
  if (data.kind !== 'skv138-task' || typeof data.title !== 'string') return;
  event.waitUntil(self.registration.showNotification(data.title.slice(0,120), {
    body: typeof data.body === 'string' ? data.body.slice(0,240) : 'Du har en oppgave i SKV138.',
    icon: '/skv138-icon.png',
    badge: '/skv138-icon.png',
    tag: typeof data.taskId === 'string' ? 'skv138-task-' + data.taskId.slice(0,120) : 'skv138-task',
    data: { url: '/?tab=oppgaver' }
  }));
});
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil((async () => {
    const target = new URL('/?tab=oppgaver', self.location.origin).href;
    const clientsList = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    const existing = clientsList.find(client => new URL(client.url).origin === self.location.origin);
    if (existing) { await existing.focus(); if ('navigate' in existing) await existing.navigate(target); return; }
    await self.clients.openWindow(target);
  })());
});
