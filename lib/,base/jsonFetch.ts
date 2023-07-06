
const DEFAULT_TIMEOUT = 20000

interface JsonFetchOptions extends RequestInit {
  method?: 'POST' | 'GET', // could potentially add PUT, etc. also
  timeout?: number,
  /** object gets `JSON.stringify`ed automatically */
  body?: any,
}

/**
 * Similar to `fetch`, but with JSON parsing built in.
 * Also has `DEFAULT_TIMEOUT`.
 * @param options
 * @param {number} options.timeout - supported via timedFetch
 * @param options.body - If present, will automatically be assumed as `method: "POST"`
 * @throws `string` instead of `Error`
 * @returns {object} the server's response parsed as JSON
 */
export default async function jsonFetch<T extends Object>(url: string, options?: JsonFetchOptions): Promise<T> {
  if (!options) options = {}
  if (options.body != null) {
    if (!options.method) options.method = 'POST'
    if (typeof options.body == 'object') {
      options.body = JSON.stringify(options.body)
      if (!options.headers) options.headers = {}
      options.headers['Content-Type'] = 'application/json'
    }
  }

  const res = await timedFetch(url, options)
  // if statements here similar to those found in Uploadables.tsx
  if (res.status == 200)
    if ((res.headers.get('Content-Type') || '').startsWith('text/plain'))
      return await res.text() as any
    else
      return await res.json()
  else if ((res.headers.get('Content-Type') || '').startsWith('text/plain'))
    throw await res.text()
  else
    throw `${res.status} ${res.statusText || 'error'}`
  throw `${res.status} ${res.statusText || 'error'}.`
}

/**
 * Shorthand syntax. So instead of
 * 
 *     url => jsonFetch(url).then(function () { ... })
 * 
 * now you can use
 * 
 *                 jsonFetch.then(function () { ... })
 */
jsonFetch.then = function (then: Function): ((url: string) => Promise<Object>) {
  return function () {
    return jsonFetch.apply(this, arguments).then(then)
  }
}

/** Similar to `fetch`, but with timeout as one of the supported `options` */
export async function timedFetch(url: string, options: JsonFetchOptions): Promise<Response> {
  var { timeout } = options

  const controller = new AbortController()
  var timedOut = false
  if (!timeout) timeout = DEFAULT_TIMEOUT
  if (timeout != null) {
    var timer = setTimeout(function () {
      timedOut = true
      controller.abort()
    }, timeout)
  }
  options.signal = controller.signal

  try {
    var response = await fetch(url, options)
      .catch((e: Error) => {
        throw e.message == 'Failed to fetch'
          ? 'Please check your internet connection.'
          : e.message || e + ''
      })
  } catch (e) {
    if (timedOut) throw `Timeout of ${timeout / 1000} seconds`
    else throw e
  } finally {
    clearTimeout(timer)
  }
  return response
}

export function formJson(form: HTMLFormElement) {
  const json = {} as { [key: string]: string }
  for (let i = 0; i < form.elements.length; i++) {
    let e = form.elements[i] as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | HTMLButtonElement
    if (e.tagName == 'BUTTON') continue
    if (e.disabled) continue
    if (!e.name) continue
    if (e.tagName == 'SELECT') {
      for (let j = 0; j < (e as HTMLSelectElement).options.length; j++)
        if ((e as HTMLSelectElement).options[j].selected)
          json[e.name] = (json[e.name] != null ? json[e.name] + '\x00' : '') + (e as HTMLSelectElement).options[j].value
    } else { // HTMLInputElement | HTMLTextAreaElement 
      const isCheckbox = e.tagName == 'INPUT' && e.type == 'checkbox'
      const isRadio = e.tagName == 'INPUT' && e.type == 'radio'
      json[e.name] = (isCheckbox || isRadio) && !(e as HTMLInputElement).checked
        ? json[e.name] != null ? json[e.name] : null
        : (json[e.name] != null ? json[e.name] + '\x00' : '') + e.value
    }
  }
  return json
}
