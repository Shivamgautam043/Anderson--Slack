export function HiddenFormField({name, value, required, pattern}: {name: string, value: string, required?: boolean, pattern?: string}) {
    return (
        <input
            type="text"
            name={name}
            value={value}
            readOnly
            className="tw-hidden"
            required={required}
            pattern={pattern}
        />
    );
}
