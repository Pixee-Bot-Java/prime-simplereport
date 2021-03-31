import USAGovBanner from "../commonComponents/USAGovBanner";
import siteLogo from "../../img/simplereport-logo-color.svg";

const ErrorPage = () => {
  return (
    <>
      <header>
        <USAGovBanner />
        <div className="border-bottom border-base-lighter padding-y-1">
          <div className="grid-container">
            <div className="maxw-card-lg">
              <img src={siteLogo} alt="{process.env.REACT_APP_TITLE}" />
            </div>
          </div>
        </div>
      </header>
      <main className="usa-section">
        <div className="grid-container usa-prose">
          <h1 className="">Something went wrong :(</h1>
          <p>Please try refreshing your browser.</p>
          <p>
            If the problem continues, contact{" "}
            <a href="mailto:support@simplereport.gov">
              support@simplereport.gov
            </a>{" "}
            for support.
          </p>
        </div>
      </main>
    </>
  );
};

export default ErrorPage;
