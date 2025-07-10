
export function isEmailOrPhone(input: string) {
    const regex = /^((\+?\d{1,4}[-\s]?)?(\(?\d{3,4}\)?[-\s]?)?\d{3,4}[-\s]?\d{3,4}|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
    return regex.test(input.trim());
}