export const pickLocalized = (
  item: { [key: string]: any },
  baseKey: string,
  lang: string
) => {
  const cleanLang = lang.split('-')[0]
  
  // Priority order: requested lang -> fallback langs
  let order: string[] = []
  if (cleanLang === 'uz') {
    order = ['uz', 'ja', 'en']
  } else if (cleanLang === 'ja') {
    order = ['ja', 'en', 'uz']
  } else {
    order = [cleanLang, 'en', 'ja', 'uz']
  }
  
  // Try each language code
  for (const code of order) {
    const val = item[`${baseKey}_${code}`]
    if (val && typeof val === 'string' && val.trim() !== '') {
      return val
    }
  }

  // Check baseKey itself (e.g. 'name')
  if (item[baseKey] && typeof item[baseKey] === 'string' && item[baseKey].trim() !== '') {
    return item[baseKey]
  }

  // Last resort: find any non-empty localized field
  // We can't easily iterate all keys without knowing them, 
  // but we covered the main ones in 'order'.
  
  return ''
}
