export const DULabelInput = ({label, defaultText}) => {
    return (
        <label className="input">
            <span className="label">{label}</span>
            <input type="text" placeholder={defaultText} />
        </label>        
    )
}