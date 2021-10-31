export async function CanConnectTo(url: string, timeout: number): Promise<boolean> {
    return new Promise((resolve) => {
        const timer = setTimeout(() => resolve(false), timeout);

        fetch(url)
            .then(() => resolve(true))
            .catch(() => resolve(false))
            .finally(() => clearTimeout(timer));
    });
}