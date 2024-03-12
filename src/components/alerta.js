import React, { Fragment } from "react";
import { useAlert } from "react-alert";

const Home = (data) => {
    const alert = useAlert();
  
    return (
      <Fragment>
        <button
          onClick={() => {
            if (data.toShow.body === null) {
                alert.success(<h6> {data.toShow.header}</h6>)
            } else {
                alert.info(
                    <div>
                        <h6> {data.toShow.header}</h6>
                        {
                            data.toShow.body.map(el => {
                                return (
                                    <li key={el}> ep: {el}
                                    </li>
                                )
                            })
                        }
                    </div>
                )
            }
            
          }}
        >
          Show Results
        </button>
      </Fragment>
    );
  };
  
  export default Home;