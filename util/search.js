export async function search(query) {
  return (await (await fetch(`https://artube-search.fly.dev?q=${encodeURIComponent(query)}`)).json()).items
}