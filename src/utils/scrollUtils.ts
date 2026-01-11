export const scrollUtils = {
    // Lock body scroll
    lockScroll: () => {
        document.body.style.overflow = 'hidden';
    },

    // Unlock body scroll
    unlockScroll: () => {
        document.body.style.overflow = 'unset';
    },

    // Toggle scroll based on condition
    toggleScroll: (shouldLock: boolean) => {
        document.body.style.overflow = shouldLock ? 'hidden' : 'unset';
    },
};
