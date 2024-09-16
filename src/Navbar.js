import React from "react";

function Navbar() {
  return (
    <>
      <nav class="navbar" style={{ backgroundColor: "#171923" }}>
        <div class="container-fluid">
          <a
            class="navbar-brand fw-bolder"
            style={{ color: "#ffffff", fontSize: "30px" }}
          >
            {/* <img
              src=""
              alt=""
              width="30"
              height="24"
              class="d-inline-block align-text-top"
            /> */}
            ImageTools.org
          </a>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
