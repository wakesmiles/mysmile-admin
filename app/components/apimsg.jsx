
const APIMessage = ({ message }) => {
    return(
        <div>
            <div>
                <h2 className="text-lg font-medium mb-4">Request Status</h2>
                <p className="text-gray-500">{message}</p>
            </div>
        </div>
    )
}

export default APIMessage