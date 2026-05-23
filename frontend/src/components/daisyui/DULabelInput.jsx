export const DULabelInput = ({id, label, defaultText}) => {
    return (
        <label className="input">
            <span className="label">{label}</span>
            <input id={id} type="text" placeholder={defaultText} />
        </label>        
    )
}