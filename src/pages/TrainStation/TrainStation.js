export const TrainStation = () => {
  return (
    <div>
      <h3 className="h3">Station</h3>
      <form className="d-flex mb-5" role="search">
        <input
          className="form-control me-2 w-75 ms-5"
          type="search"
          placeholder="Search"
          aria-label="Search"
        />
        <button className="btn btn-outline-success" type="submit">
          Search
        </button>
      </form>
      <table class="table">
        <thead>
          <tr>
            <th scope="col">No</th>
            <th scope="col">Station Name</th>
            <th scope="col">Station Master Name</th>
            <th scope="col">Contact Number</th>
            <th scope="col">Adjacent Station</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">1</th>
            <td>Fort</td>
            <td>Supun Prabath</td>
            <td>011-3070447</td>
            <td>Colombo 10, Slave island</td>
          </tr>
          <tr>
            <th scope="row">2</th>
            <td>Colombo 10</td>
            <td>Can Yaman</td>
            <td>011-2695722</td>
            <td>Fort, Dematagoda, Base line</td>
          </tr>
          <tr>
            <th scope="row">2</th>
            <td>Slave Island</td>
            <td>Hirantha Kumara</td>
            <td>011-2422624</td>
            <td>Fort, Colombo 3</td>
          </tr>
        </tbody>
      </table>
      <input class="btn btn-primary" type="submit" value="Add New"></input>
    </div>
  );
};
