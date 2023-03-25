

const Signuptable = ( {signups} ) => {
    return (
        <div>
          <h2>Signups Table</h2>
          <table>
            <thead>
              <tr>
                <th>Shift ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Clock In</th>
                <th>Clock Out</th>
                <th>Hours</th>
              </tr>
            </thead>
            <tbody>
              {signups.data.map((signup) => (
                <>
                  <tr key={signup.id}>
                    <td>{signup.shift_id}</td>
                    <td>{signup.first_name}</td>
                    <td>{signup.last_name}</td>
                    <td>{signup.clock_in}</td>
                    <td>{signup.clock_out}</td>
                     <td>{signup.hours}</td>
                  </tr>
                </>
              ))}
            </tbody>
          </table>
        </div>
    )
}

export default Signuptable