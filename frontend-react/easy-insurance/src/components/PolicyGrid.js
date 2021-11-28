import { useEffect, useState } from "react";
import axios from "axios";

function PolicyGrid() {
  const [policyData, setPolicyData] = useState([]);
  const [policyDataChunkToUpdate, setPolicyDataChunkToUpdate] = useState([]);

  const booleanDict = {
      1 : "True",
      0 : "False"
  }
  // const [sear]

  // GET request function to your Mock API
  // const fetchInventory = () => {
  //         getPolicyDetails({}).then(responseData => {
  //             setPolicyData(responseData.data.recordset)
  //         })
  // }

  function getPolicyDetails(searchObject) {
    return axios.get("/getpolicydetails", { params: searchObject });
  }

  function searchByPolicyCustomerId(event) {
    getPolicyDetails({ searchable: event.target.value }).then((responseData) => {
      if(responseData.data.recordset.length == 0){
          alert("No results found. Please try with a different Customer/Policy Id")
          event.target.value = ""

      }
      else{
      setPolicyData([...responseData.data.recordset]);
      setPolicyDataChunkToUpdate({ ...responseData.data.recordset[0] });
      }
    });
  }



  // Calling the function on component mount
  useEffect(() => {
    getPolicyDetails({}).then((responseData) => {
      setPolicyData([...responseData.data.recordset]);
      setPolicyDataChunkToUpdate({ ...responseData.data.recordset[0] });

      var searchInput = document.getElementById("search");

      // Execute a function when the user releases a key on the keyboard
      searchInput.addEventListener("keyup", function (event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            // console.log(event)
            searchByPolicyCustomerId(event)
        }
      });
    });
    
  }, []);

  //Edit code

  // const [inEditMode, setInEditMode] = useState({
  //     status: false,
  //     rowKey: null
  // });

  // const [unitPrice, setUnitPrice] = useState(null);

  // /**
  //  *
  //  * @param id - The id of the product
  //  * @param currentUnitPrice - The current unit price of the product
  //  */
  // const onEdit = ({id, currentUnitPrice}) => {
  //     setInEditMode({
  //         status: true,
  //         rowKey: id
  //     })
  //     setUnitPrice(currentUnitPrice);
  // }

  // /**
  //  *
  //  * @param id
  //  * @param newUnitPrice
  //  */
  // const updateInventory = ({id, newUnitPrice}) => {
  //     fetch(`${INVENTORY_API_URL}/${id}`, {
  //         method: "PATCH",
  //         body: JSON.stringify({
  //             unit_price: newUnitPrice
  //         }),
  //         headers: {
  //             "Content-type": "application/json; charset=UTF-8"
  //         }
  //     })
  //         .then(response => response.json())
  //         .then(json => {
  //             // reset inEditMode and unit price state values
  //             onCancel();

  //             // fetch the updated data
  //             fetchInventory();
  //         })
  // }

  // /**
  //  *
  //  * @param id -The id of the product
  //  * @param newUnitPrice - The new unit price of the product
  //  */
  // const onSave = ({id, newUnitPrice}) => {
  //     updateInventory({id, newUnitPrice});
  // }

  // const onCancel = () => {
  //     // reset the inEditMode state value
  //     setInEditMode({
  //         status: false,
  //         rowKey: null
  //     })
  //     // reset the unit price state value
  //     setUnitPrice(null);
  // }

  //

  function handleSearchChange(e) {
    console.log(e.target);
  }

  function updatePolicyDetails(chunk, event,index) {
    let allChildNodes = document.getElementById("table-tbody").childNodes
    allChildNodes.forEach(element=>{
        element.style.background = ""
    })
    let rowToFocus = allChildNodes[index]
    rowToFocus.style.background = "#ffc107"
    // console.log('index',index,document.getElementById("table-tbody").childNodes);
    setPolicyDataChunkToUpdate(chunk);
  }

  function updatePolicyDetailsDatabase() {
      if(parseInt(policyDataChunkToUpdate["PREMIUM"]) > 1000000 ){
        alert("Policy premium can't be more than 1 Million")
      }
      else{
        axios
        .post("/updatepolicydetails", { ...policyDataChunkToUpdate })
        .then((response) => {
          if (response.data.hasOwnProperty("recordset")) {
            alert(response.data.message);
            setPolicyData([...response.data.recordset]);
            setPolicyDataChunkToUpdate({ ...response.data.recordset[0] });
          }
        });
      }

  }

  function handleInputChange(event, key) {
    console.log(event.target.value);
    console.log("key", key);
    setPolicyDataChunkToUpdate((policyDataChunkToUpdate) => ({
      ...policyDataChunkToUpdate,
      [key]: event.target.value,
    }));

    // setState(policyDataChunkToUpdate => ({
    //     ...policyDataChunkToUpdate,
    //     [key]: event.target.value
    // }));
  }

  return (
    <div className="datatable-grid">
      <div>
        <input
          type="number"
          id="search"
          className="form-control"
          placeholder="Enter Policy/Customer Id"
          onChange={(e) => handleSearchChange(e)}
        />
        <table>
          <thead>
            <tr>
              <th>POLICY ID</th>
              <th>DATE OF PURCHASE</th>
              <th>CUSTOMER ID</th>
              <th>FUEL</th>
              <th>VEHICLE SEGMENT</th>
              <th>PREMIUM</th>
              <th>BODILY INJURY LIABILITY</th>
              <th>PERSONAL INJURY PROTECTION</th>
              <th>PROPERTY DAMAGE LIABILITY</th>
              <th>COLLISION</th>
              <th>COMPREHENSIVE</th>
            </tr>
          </thead>
          <tbody id= "table-tbody">
            {policyData.map((item,index) => (
              <tr
                className="tbody-tr"
                key={item.POLICY_ID}
                onClick={(e) => updatePolicyDetails(item, e,index)}
              >
                <td>{item.POLICY_ID}</td>
                <td>{item.DATE_OF_PURCHASE.substring(0,10)}</td>
                <td>{item.CUSTOMER_ID}</td>
                <td>{item.FUEL}</td>
                <td>{item.VEHICLE_SEGMENT}</td>
                <td>{item.PREMIUM}</td>
                <td>{booleanDict[item.BODILY_INJURY_LIABILITY]}</td>
                <td>{booleanDict[item.PERSONAL_INJURY_PROTECTION]}</td>
                <td>{booleanDict[item.PROPERTY_DAMAGE_LIABILITY]}</td>
                <td>{booleanDict[item.COLLISION]}</td>
                <td>{booleanDict[item.COMPREHENSIVE]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div id="policy-chunk">
        <form>
            <h4 id = "update-policy-head">Update Policy : {policyDataChunkToUpdate.POLICY_ID}</h4>
          <div className="form-group row">
            <label className="col-sm-6 control-label" htmlFor="CUSTOMER_ID">
              Customer ID
            </label>
            <div className="col-sm-6">
               {" "}
              <input
                type="number"
                id="CUSTOMER_ID"
                className="form-control"
                value={policyDataChunkToUpdate.CUSTOMER_ID}
                onChange={(e) => handleInputChange(e, "CUSTOMER_ID")}
              />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-6 control-label" htmlFor="FUEL">
              Fuel
            </label>
            <div className="col-sm-6">
               {" "}
              <input
                type="text"
                id="FUEL"
                className="form-control"
                value={policyDataChunkToUpdate.FUEL}
                onChange={(e) => handleInputChange(e, "FUEL")}
              />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-6 control-label" htmlFor="VEHICLE_SEGMENT">
              Vehicle Segment
            </label>
            <div className="col-sm-6">
               {" "}
              <input
                type="text"
                id="VEHICLE_SEGMENT"
                className="form-control"
                value={policyDataChunkToUpdate.VEHICLE_SEGMENT}
                onChange={(e) => handleInputChange(e, "VEHICLE_SEGMENT")}
              />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-6 control-label" htmlFor="PREMIUM">
              Premium
            </label>
            <div className="col-sm-6">
               {" "}
              <input
                type="number"
                id="PREMIUM"
                className="form-control"
                value={policyDataChunkToUpdate.PREMIUM}
                onChange={(e) => handleInputChange(e, "PREMIUM")}
              />
            </div>
          </div>
          <div className="form-group row">
            <label
              className="col-sm-6 control-label"
              htmlFor="BODILY_INJURY_LIABILITY"
            >
              Bodily Injury Liability
            </label>
            <div className="col-sm-6">
               {" "}
              <input
                type="number"
                id="BODILY_INJURY_LIABILITY"
                className="form-control"
                value={policyDataChunkToUpdate.BODILY_INJURY_LIABILITY}
                onChange={(e) =>
                  handleInputChange(e, "BODILY_INJURY_LIABILITY")
                }
              />
            </div>
          </div>
          <div className="form-group row">
            <label
              className="col-sm-6 control-label"
              htmlFor="PERSONAL_INJURY_PROTECTION"
            >
              Personal Injury Protection
            </label>
            <div className="col-sm-6">
               {" "}
              <input
                type="number"
                id="PERSONAL_INJURY_PROTECTION"
                className="form-control"
                value={policyDataChunkToUpdate.PERSONAL_INJURY_PROTECTION}
                onChange={(e) =>
                  handleInputChange(e, "PERSONAL_INJURY_PROTECTION")
                }
              />
            </div>
          </div>
          <div className="form-group row">
            <label
              className="col-sm-6 control-label"
              htmlFor="PROPERTY_DAMAGE_LIABILITY"
            >
              Property Damage Liability
            </label>
            <div className="col-sm-6">
               {" "}
              <input
                type="number"
                id="PROPERTY_DAMAGE_LIABILITY"
                className="form-control"
                value={policyDataChunkToUpdate.PROPERTY_DAMAGE_LIABILITY}
                onChange={(e) =>
                  handleInputChange(e, "PROPERTY_DAMAGE_LIABILITY")
                }
              />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-6 control-label" htmlFor="COLLISION">
              Collision
            </label>
            <div className="col-sm-6">
               {" "}
              <input
                type="number"
                id="COLLISION"
                className="form-control"
                value={policyDataChunkToUpdate.COLLISION}
                onChange={(e) => handleInputChange(e, "COLLISION")}
              />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-6 control-label" htmlFor="COMPREHENSIVE">
              Comprehensive
            </label>
            <div className="col-sm-6">
               {" "}
              <input
                type="number"
                id="COMPREHENSIVE"
                className="form-control"
                value={policyDataChunkToUpdate.COMPREHENSIVE}
                onChange={(e) => handleInputChange(e, "COMPREHENSIVE")}
              />
            </div>
          </div>
        </form>
        <div id="button-holder">
          <span className="button-span">
            <button
              className="btn btn-success"
              onClick={updatePolicyDetailsDatabase}
            >
              Update
            </button>
          </span>
          {/* <span className="button-span"><button className ="btn btn-danger">Reset</button></span> */}
        </div>
      </div>
    </div>
  );
}

export default PolicyGrid;

// <tr>
// <th>POLICY_ID</th>
// <th>DATE_OF_PURCHASE</th>
// <th>CUSTOMER_ID</th>
// <th>FUEL</th>
// <th>VEHICLE_SEGMENT</th>
// <th>PREMIUM</th>
// <th>BODILY_INJURY_LIABILITY</th>
// <th>PERSONAL_INJURY_PROTECTION</th>
// <th>PROPERTY_DAMAGE_LIABILITY</th>
// <th>COLLISION</th>
// <th>COMPREHENSIVE</th>
// </tr>
