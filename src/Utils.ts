export function CanConnectTo(url: string, timeout = 3000): Promise<boolean> {
    return new Promise((resolve) => {
        const timer = setTimeout(() => resolve(false), timeout);

        fetch(url)
            .then(() => resolve(true))
            .catch(() => resolve(false))
            .finally(() => clearTimeout(timer));
    });
}