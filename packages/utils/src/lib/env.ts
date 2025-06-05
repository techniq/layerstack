// Since it's not recommended to use `$app/environment` or `import.meta.‍env.SSR`, expose these instead
// See: https://kit.svelte.dev/docs/packaging
export const browser = typeof window !== 'undefined';
export const ssr = typeof window === 'undefined';

/**
 * Get platform details of browser (operating system, etc.)
 */
export const platform = {
  getOS() {
    const userAgent = navigator.userAgent;

    if (userAgent.includes('Mac')) {
      return 'macOS';
    } else if (userAgent.includes('Windows')) {
      return 'Windows';
    } else if (userAgent.includes('Linux')) {
      return 'Linux';
    } else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
      return 'iOS';
    } else if (userAgent.includes('Android')) {
      return 'Android';
    }

    return 'Unknown';
  },

  isMac() {
    return this.getOS() === 'macOS';
  },
  isWindows() {
    return this.getOS() === 'Windows';
  },
  isLinux() {
    return this.getOS() === 'Linux';
  },
  isIOS() {
    return this.getOS() === 'iOS';
  },
  isAndroid() {
    return this.getOS() === 'Android';
  },

  getModifierSymbol() {
    return this.isMac() ? '⌘' : 'Ctrl';
  },

  getModifierKey() {
    return this.isMac() ? 'metaKey' : 'ctrlKey';
  },
};
