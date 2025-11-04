import React, { useState } from "react";
import { KentrixFiltersDescription } from "../components/KentrixFiltersDescription";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const KentrixFiltersPage = ({
  formdata,
  handleRegionTypeChange,
  handleIncomeChange,
  handleLifestyleChange,
  handleSecReferenceChange,
  handleHealthCareChange,
  handleInsuranceChange,
  handleBankingProductChange,
  handleCreditCardChange,
  handleAutomobileChange,
  handleRealEstateChange,
  handleLaundryChange,
  handlePersonalWashChange,
  handlePackagedFoodChange,
  handleCosmeticsChange,
  handleFashionChange,
  handleJewelleryTotalChange,
  handleJewelleryGoldChange,
  handleJewelleryDiamondChange,
  handleTravelSpendChange,
  handleTravelDestinationChange,
  handleOnlineRetailChange,
  handleRetailChange,
  handleTwoWheelerChange,
  handleTVChange,
  handleSmartphoneChange,
  handleRefrigeratorChange,
  handleWashingMachineChange,
  handleAirConditionerChange,
}) => {
  function formatIndianNumber(number) {
    const str = number.toString();
    const formattedNumber = [];
    let counter = 0;
    let commaPositions = [3, 5, 7, 9];

    for (let i = str.length - 1; i >= 0; i--) {
      formattedNumber.unshift(str[i]);
      counter++;

      if (commaPositions.includes(counter) && i !== 0) {
        formattedNumber.unshift(",");
      }
    }

    return formattedNumber.join("");
  }

  const [selectedId, setSelectedId] = useState(null);

  // Helper function to get filter description by ID
  const getFilterById = (id) => {
    return KentrixFiltersDescription.find((item) => item.ID === id);
  };

  const FilterDescriptionFunction = ({ id }) => {
    const filterDescription = getFilterById(id);

    const hasPopUpInfoIconDescription = Boolean(
      filterDescription?.PopUpInfoIconDescription
    );

    return (
      <div className="product_filters_content">
        <p className="filter_description">
          {filterDescription?.OneLiner}
          {hasPopUpInfoIconDescription && (
            <button
              data-bs-toggle="modal"
              data-bs-target="#filterDescription"
              onClick={() => {
                setSelectedId(id);
              }}
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                padding: "0 0 0 8px",
                verticalAlign: "middle",
                color: "#1976d2",
              }}
            >
              <InfoOutlinedIcon
                style={{
                  fontSize: "18px",
                  verticalAlign: "middle",
                }}
              />
            </button>
          )}
        </p>
      </div>
    );
  };

  const PopupContent = ({ selectedId }) => {
    const filterDescription = getFilterById(selectedId);
    return (
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" id="filterDescriptionLabel">
            Filter Info
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div className="modal-body">
          <div className="popup_item">
            <label className="popup_heading">
              <strong>
                {" "}
                {filterDescription?.["Group"]} &gt;{" "}
                {filterDescription?.["Category"]} &gt;{" "}
                {filterDescription?.["SubCategory"]}
              </strong>
            </label>
            <p>{filterDescription?.["PopUpInfoIconDescription"]}</p>
          </div>
        </div>
      </div>
    );
  };

  // Group filters by category
  const rtFilters = KentrixFiltersDescription.filter(
    (f) => f.Category === "Regio_Type"
  );

  const incomeFilters = KentrixFiltersDescription.filter(
    (f) => f.Category === "Income"
  );
  const lifestyleFilters = KentrixFiltersDescription.filter(
    (f) => f.Category === "Lifestyle"
  );
  const nccsFilters = KentrixFiltersDescription.filter(
    (f) => f.Category === "NCCS Reference"
  );
  const healthCareFilters = KentrixFiltersDescription.filter(
    (f) => f.Category === "Special Health Care Target Group"
  );
  const insuranceFilters = KentrixFiltersDescription.filter((f) =>
    f.Category.startsWith("Insurance:")
  );
  const bankingProductFilters = KentrixFiltersDescription.filter(
    (f) =>
      f.Category.startsWith("Banking:") && !f.Category.includes("Credit Card")
  );
  const creditCardFilters = KentrixFiltersDescription.filter(
    (f) => f.Category === "Banking: Credit Card Holding"
  );
  const automobileFilters = KentrixFiltersDescription.filter(
    (f) => f.Group === "Automobile"
  );
  const twoWheelerFilters = KentrixFiltersDescription.filter(
    (f) => f.Group === "Two Wheeler"
  );
  const realEstateFilters = KentrixFiltersDescription.filter(
    (f) => f.Group === "Real Estate"
  );
  const laundryFilters = KentrixFiltersDescription.filter(
    (f) => f.Category === "Laundry"
  );
  const personalWashFilters = KentrixFiltersDescription.filter(
    (f) => f.Category === "Personal Wash"
  );
  const packagedFoodFilters = KentrixFiltersDescription.filter(
    (f) => f.Category === "Packaged Food"
  );
  const cosmeticsFilters = KentrixFiltersDescription.filter(
    (f) => f.Category === "Cosmetics"
  );
  const fashionFilters = KentrixFiltersDescription.filter(
    (f) => f.Category === "Purchase Price Category"
  );
  const jewelleryTotalFilters = KentrixFiltersDescription.filter(
    (f) => f.Category === "Category: Total"
  );
  const jewelleryGoldFilters = KentrixFiltersDescription.filter(
    (f) => f.Category === "Category: Gold"
  );
  const jewelleryDiamondFilters = KentrixFiltersDescription.filter(
    (f) => f.Category === "Category: Diamond"
  );
  const travelShortFilters = KentrixFiltersDescription.filter(
    (f) => f.Category === "Short Term Holidays"
  );
  const travelLongFilters = KentrixFiltersDescription.filter(
    (f) => f.Category === "Long Term Holidays"
  );
  const onlineRetailFilters = KentrixFiltersDescription.filter(
    (f) => f.Category === "High Frequency Online Shopping"
  );
  const homeAndLivingFilters = KentrixFiltersDescription.filter(
    (f) => f.Category === "Home and Living"
  );
  const electronicsTVFilters = KentrixFiltersDescription.filter(
    (f) => f.Category === "TV"
  );
  const electronicsSmartphoneFilters = KentrixFiltersDescription.filter(
    (f) => f.Category === "Smartphone"
  );
  const electronicsRefrigeratorFilters = KentrixFiltersDescription.filter(
    (f) => f.Category === "Refrigerator"
  );
  const electronicsWashingMachineFilters = KentrixFiltersDescription.filter(
    (f) => f.Category === "Washing Machine"
  );
  const electronicsAirConditionerFilters = KentrixFiltersDescription.filter(
    (f) => f.Category === "Air Conditioner"
  );

  return (
    <>
      <div className="filter_container">
        <div className="accordion">

          {/* Regio Type Section */}
          <div className="accordion-item">
            <h2 className="accordion-header" id="panelsStayOpen-headingRT">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#panelsStayOpen-collapseheadingheadingRT"
                aria-expanded="false"
                aria-controls="panelsStayOpen-collapseheadingheadingRT"
              >
                Regio-type : Urban
              </button>
            </h2>
            <div
              id="panelsStayOpen-collapseheadingheadingRT"
              className="accordion-collapse collapse"
              aria-labelledby="panelsStayOpen-headingheadingRT"
            >
              <div id="regio_type" className="accordion-body">
                <p className="accordion-title">
                  {rtFilters[0]?.FilterDescription}
                </p>
                {rtFilters.map((filter, index) => (
                  <li key={filter.ID} className="product_filters">
                    <label
                      className="product_filters_label"
                      title={filter.PopUpInfoIconDescription || filter.OneLiner}
                    >
                      <input
                        className="form-check-input rest me-1"
                        type="checkbox"
                        value={String(index + 1)}
                        checked={
                          formdata.regio_type &&
                          formdata.regio_type.includes(String(index + 1))
                        }
                        onChange={handleRegionTypeChange}
                      />
                      {filter.SubCategory}
                    </label>
                    <FilterDescriptionFunction id={filter.ID} />
                  </li>
                ))}
              </div>
            </div>
          </div>



          {/* Income Section */}
          <div className="accordion-item">
            <h2 className="accordion-header" id="panelsStayOpen-headingIncome">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#panelsStayOpen-collapseheadingIncome"
                aria-expanded="false"
                aria-controls="panelsStayOpen-collapseheadingIncome"
              >
                Socio-Economic Profile (Income)
              </button>
            </h2>
            <div
              id="panelsStayOpen-collapseheadingIncome"
              className="accordion-collapse collapse"
              aria-labelledby="panelsStayOpen-headingIncome"
            >
              <div id="income" className="accordion-body">
                <p className="accordion-title">
                  {incomeFilters[0]?.FilterDescription}
                </p>
                {incomeFilters.map((filter, index) => (
                  <li key={filter.ID} className="product_filters">
                    <label
                      className="product_filters_label"
                      title={filter.PopUpInfoIconDescription || filter.OneLiner}
                    >
                      <input
                        className="form-check-input rest me-1"
                        type="checkbox"
                        value={String(index + 1)}
                        checked={
                          formdata.income &&
                          formdata.income.includes(String(index + 1))
                        }
                        onChange={handleIncomeChange}
                      />
                      {filter.SubCategory}
                    </label>
                    <FilterDescriptionFunction id={filter.ID} />
                  </li>
                ))}
              </div>
            </div>
          </div>

          {/* Lifestyle */}
          <div className="accordion-item">
            <h2
              className="accordion-header"
              id="panelsStayOpen-headingLifestyle"
            >
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#panelsStayOpen-collapseheadingLifestyle"
                aria-expanded="false"
                aria-controls="panelsStayOpen-collapseheadingLifestyle"
              >
                Consumer Segments Lifestyle
              </button>
            </h2>
            <div
              id="panelsStayOpen-collapseheadingLifestyle"
              className="accordion-collapse collapse"
              aria-labelledby="panelsStayOpen-headingLifestyle"
            >
              <div id="health_care" className="accordion-body">
                <p className="accordion-title">
                  {lifestyleFilters[0]?.FilterDescription}
                </p>
                {lifestyleFilters.map((filter, index) => (
                  <li key={filter.ID} className="product_filters">
                    <label
                      className="product_filters_label"
                      title={filter.PopUpInfoIconDescription || filter.OneLiner}
                    >
                      <input
                        className="form-check-input rest me-1"
                        type="checkbox"
                        value={String(index + 1)}
                        onChange={handleLifestyleChange}
                        checked={
                                formdata.lifestyle &&
                                formdata.lifestyle.includes(String(index + 1))
                              }
                      />
                      {filter.SubCategory.replace(/^\d+:\s*/, "")}
                    </label>
                    <FilterDescriptionFunction id={filter.ID} />
                  </li>
                ))}
              </div>
            </div>
          </div>


          {/* Health Care */}
          <div className="accordion-item">
            <h2
              className="accordion-header"
              id="panelsStayOpen-headingHealthCare"
            >
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#panelsStayOpen-collapseheadingHealthCare"
                aria-expanded="false"
                aria-controls="panelsStayOpen-collapseheadingHealthCare"
              >
                Special Health Care Target Group
              </button>
            </h2>
            <div
              id="panelsStayOpen-collapseheadingHealthCare"
              className="accordion-collapse collapse"
              aria-labelledby="panelsStayOpen-headingHealthCare"
            >
              <div id="health_care" className="accordion-body">
                <p className="accordion-title">
                  {healthCareFilters[0]?.FilterDescription}
                </p>
                {healthCareFilters.map((filter, index) => (
                  <li key={filter.ID} className="product_filters">
                    <label
                      className="product_filters_label"
                      title={filter.PopUpInfoIconDescription || filter.OneLiner}
                    >
                      <input
                        className="form-check-input rest me-1"
                        type="checkbox"
                        value={String(index + 1)}
                        onChange={handleHealthCareChange}
                        checked={
                                formdata.health_care &&
                                formdata.health_care.includes(String(index + 1))
                              }
                      />
                      {filter.SubCategory}
                    </label>
                    <FilterDescriptionFunction id={filter.ID} />
                  </li>
                ))}
              </div>
            </div>
          </div>

          {/* Automobile Section */}
          <div className="accordion-item">
            <h2
              className="accordion-header"
              id="panelsStayOpen-headingAutomobile"
            >
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#panelsStayOpen-collapseheadingAutomobile"
                aria-expanded="false"
                aria-controls="panelsStayOpen-collapseheadingAutomobile"
              >
                Automobile
              </button>
            </h2>
            <div
              id="panelsStayOpen-collapseheadingAutomobile"
              className="accordion-collapse collapse"
              aria-labelledby="panelsStayOpen-headingAutomobile"
            >
              <div id="automobile" className="accordion-body">
                <p className="accordion-title">
                  {automobileFilters[0]?.FilterDescription}
                </p>
                {automobileFilters.map((filter, index) => (
                  <li key={filter.ID} className="product_filters">
                    <label
                      className="product_filters_label"
                      title={filter.PopUpInfoIconDescription || filter.OneLiner}
                    >
                      <input
                        className="form-check-input rest me-1"
                        type="checkbox"
                        value={`automobile_${index + 1}`}
                        onChange={handleAutomobileChange}
                        checked={
                          formdata.automobile &&
                          formdata.automobile.includes(
                            `automobile_${index + 1}`
                          )
                        }
                      />
                      {filter.Category}
                    </label>
                    <FilterDescriptionFunction id={filter.ID} />
                  </li>
                ))}
              </div>
            </div>
          </div>

          {/* Two Wheeler Section */}
          <div className="accordion-item">
            <h2
              className="accordion-header"
              id="panelsStayOpen-headingTwoWheeler"
            >
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#panelsStayOpen-collapseheadingTwoWheeler"
                aria-expanded="false"
                aria-controls="panelsStayOpen-collapseheadingTwoWheeler"
              >
                Two Wheeler
              </button>
            </h2>
            <div
              id="panelsStayOpen-collapseheadingTwoWheeler"
              className="accordion-collapse collapse"
              aria-labelledby="panelsStayOpen-headingTwoWheeler"
            >
              <div id="two_wheeler" className="accordion-body">
                <p className="accordion-title">
                  {twoWheelerFilters[0]?.FilterDescription}
                </p>
                {twoWheelerFilters.map((filter, index) => (
                  <li key={filter.ID} className="product_filters">
                    <label
                      className="product_filters_label"
                      title={filter.PopUpInfoIconDescription || filter.OneLiner}
                    >
                      <input
                        className="form-check-input rest me-1"
                        type="checkbox"
                        value={`two_wheeler_${index + 1}`}
                        onChange={handleTwoWheelerChange}
                        checked={
                          formdata.two_wheeler &&
                          formdata.two_wheeler.includes(
                            `two_wheeler_${index + 1}`
                          )
                        }
                      />
                      {filter.Category}
                    </label>
                    <FilterDescriptionFunction id={filter.ID} />
                  </li>
                ))}
              </div>
            </div>
          </div>

          {/* Financial Products */}
          <div className="accordion-item">
            <h2
              className="accordion-header"
              id="panelsStayOpen-headingFinancialProducts"
            >
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#panelsStayOpen-collapseheadingFinancialProducts"
                aria-expanded="false"
                aria-controls="panelsStayOpen-collapseheadingFinancialProducts"
              >
                Financial Products
              </button>
            </h2>
            <div
              id="panelsStayOpen-collapseheadingFinancialProducts"
              className="accordion-collapse collapse"
              aria-labelledby="panelsStayOpen-headingFinancialProducts"
            >
              <div className="accordion-body">
                <p className="accordion-title">
                  {insuranceFilters[0]?.FilterDescription}
                </p>

                {/* Insurance */}
                <div className="accordion-item">
                  <h2
                    className="accordion-header"
                    id="panelsStayOpen-headingInsurance"
                  >
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#panelsStayOpen-collapseheadingInsurance"
                      aria-expanded="false"
                      aria-controls="panelsStayOpen-collapseheadingInsurance"
                    >
                      Insurance
                    </button>
                  </h2>
                  <div
                    id="panelsStayOpen-collapseheadingInsurance"
                    className="accordion-collapse collapse"
                    aria-labelledby="panelsStayOpen-headingInsurance"
                  >
                    <div id="insurance" className="accordion-body">
                      {insuranceFilters.map((filter, index) => {
                        const valueMap = {
                          0: "insurance_saving_plan",
                          1: "insurance_retirement_plan",
                          2: "insurance_unit_linked_plan",
                          3: "insurance_health",
                        };
                        return (
                          <li key={filter.ID} className="product_filters">
                            <label
                              className="product_filters_label"
                              title={
                                filter.PopUpInfoIconDescription ||
                                filter.OneLiner
                              }
                            >
                              <input
                                className="form-check-input rest me-1"
                                type="checkbox"
                                value={valueMap[index]}
                                onChange={handleInsuranceChange}
                                checked={
                                  formdata.insurance &&
                                  formdata.insurance.includes(valueMap[index])
                                }
                              />
                              {filter.Category}
                            </label>
                            <FilterDescriptionFunction id={filter.ID} />
                          </li>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Banking */}
                <div className="accordion-item">
                  <h2
                    className="accordion-header"
                    id="panelsStayOpen-headingBanking"
                  >
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#panelsStayOpen-collapseheadingBanking"
                      aria-expanded="false"
                      aria-controls="panelsStayOpen-collapseheadingBanking"
                    >
                      Banking
                    </button>
                  </h2>
                  <div
                    id="panelsStayOpen-collapseheadingBanking"
                    className="accordion-collapse collapse"
                    aria-labelledby="panelsStayOpen-headingBanking"
                  >
                    <div className="accordion-body">
                      {/* Banking Product */}
                      <div className="accordion-item">
                        <h2
                          className="accordion-header"
                          id="panelsStayOpen-headingBankingProduct"
                        >
                          <button
                            className="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#panelsStayOpen-collapseheadingBankingProduct"
                            aria-expanded="false"
                            aria-controls="panelsStayOpen-collapseheadingBankingProduct"
                          >
                            Banking Product
                          </button>
                        </h2>
                        <div
                          id="panelsStayOpen-collapseheadingBankingProduct"
                          className="accordion-collapse collapse"
                          aria-labelledby="panelsStayOpen-headingBankingProduct"
                        >
                          <div id="banking_product" className="accordion-body">
                            {bankingProductFilters.map((filter, index) => {
                              const valueMap = {
                                0: "banking_product_mutual_fund",
                                1: "banking_product_fixed_deposit",
                              };
                              return (
                                <li key={filter.ID} className="product_filters">
                                  <label
                                    className="product_filters_label"
                                    title={
                                      filter.PopUpInfoIconDescription ||
                                      filter.OneLiner
                                    }
                                  >
                                    <input
                                      className="form-check-input rest me-1"
                                      type="checkbox"
                                      value={valueMap[index]}
                                      onChange={handleBankingProductChange}
                                      checked={
                                        formdata.banking_product &&
                                        formdata.banking_product.includes(
                                          valueMap[index]
                                        )
                                      }
                                    />
                                    {filter.Category}
                                  </label>
                                  <FilterDescriptionFunction id={filter.ID} />
                                </li>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Credit Card Holding */}
                      <div className="accordion-item">
                        <h2
                          className="accordion-header"
                          id="panelsStayOpen-headingCreditCardHolding"
                        >
                          <button
                            className="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#panelsStayOpen-collapseheadingCreditCardHolding"
                            aria-expanded="false"
                            aria-controls="panelsStayOpen-collapseheadingCreditCardHolding"
                          >
                            Credit Card Holding
                          </button>
                        </h2>
                        <div
                          id="panelsStayOpen-collapseheadingCreditCardHolding"
                          className="accordion-collapse collapse"
                          aria-labelledby="panelsStayOpen-headingCreditCardHolding"
                        >
                          <div id="credit_card" className="accordion-body">
                            {creditCardFilters.map((filter, index) => (
                              <li key={filter.ID} className="product_filters">
                                <label
                                  className="product_filters_label"
                                  title={
                                    filter.PopUpInfoIconDescription ||
                                    filter.OneLiner
                                  }
                                >
                                  <input
                                    className="form-check-input rest me-1"
                                    type="checkbox"
                                    value={String(index + 1)}
                                    onChange={handleCreditCardChange}
                                    checked={
                                      formdata.credit_card &&
                                      formdata.credit_card.includes(
                                        String(index + 1)
                                      )
                                    }
                                  />
                                  {filter.SubCategory}
                                </label>
                                <FilterDescriptionFunction id={filter.ID} />
                              </li>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FMCG */}
          <div className="accordion-item">
            <h2 className="accordion-header" id="panelsStayOpen-headingFMCG">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#panelsStayOpen-collapseheadingFMCG"
                aria-expanded="false"
                aria-controls="panelsStayOpen-collapseheadingFMCG"
              >
                FMCG
              </button>
            </h2>
            <div
              id="panelsStayOpen-collapseheadingFMCG"
              className="accordion-collapse collapse"
              aria-labelledby="panelsStayOpen-headingFMCG"
            >
              <div className="accordion-body">
                <p className="accordion-title">
                  {laundryFilters[0]?.FilterDescription}
                </p>

                {/* Laundry */}
                <div className="accordion-item">
                  <h2
                    className="accordion-header"
                    id="panelsStayOpen-headingLaundry"
                  >
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#panelsStayOpen-collapseheadingLaundry"
                      aria-expanded="false"
                      aria-controls="panelsStayOpen-collapseheadingLaundry"
                    >
                      Laundry
                    </button>
                  </h2>
                  <div
                    id="panelsStayOpen-collapseheadingLaundry"
                    className="accordion-collapse collapse"
                    aria-labelledby="panelsStayOpen-headingLaundry"
                  >
                    <div id="laundry" className="accordion-body">
                      {laundryFilters.map((filter, index) => {
                        const valueMap = ["1", "2", "laundry_washing_machine"];
                        return (
                          <li key={filter.ID} className="product_filters">
                            <label
                              className="product_filters_label"
                              title={
                                filter.PopUpInfoIconDescription ||
                                filter.OneLiner
                              }
                            >
                              <input
                                className="form-check-input rest me-1"
                                type="checkbox"
                                value={valueMap[index]}
                                onChange={handleLaundryChange}
                                checked={
                                  formdata.laundry &&
                                  formdata.laundry.includes(valueMap[index])
                                }
                              />
                              {filter.SubCategory}
                            </label>
                            <FilterDescriptionFunction id={filter.ID} />
                          </li>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Personal Wash */}
                <div className="accordion-item">
                  <h2
                    className="accordion-header"
                    id="panelsStayOpen-headingPersonalWash"
                  >
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#panelsStayOpen-collapseheadingPersonalWash"
                      aria-expanded="false"
                      aria-controls="panelsStayOpen-collapseheadingPersonalWash"
                    >
                      Personal Wash
                    </button>
                  </h2>
                  <div
                    id="panelsStayOpen-collapseheadingPersonalWash"
                    className="accordion-collapse collapse"
                    aria-labelledby="panelsStayOpen-headingPersonalWash"
                  >
                    <div id="personal_wash" className="accordion-body">
                      {personalWashFilters.map((filter, index) => (
                        <li key={filter.ID} className="product_filters">
                          <label
                            className="product_filters_label"
                            title={
                              filter.PopUpInfoIconDescription || filter.OneLiner
                            }
                          >
                            <input
                              className="form-check-input rest me-1"
                              type="checkbox"
                              value={String(index + 1)}
                              onChange={handlePersonalWashChange}
                              checked={
                                formdata.personal_wash &&
                                formdata.personal_wash.includes(
                                  String(index + 1)
                                )
                              }
                            />
                            {filter.SubCategory}
                          </label>
                          <FilterDescriptionFunction id={filter.ID} />
                        </li>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Packaged Food */}
                <div className="accordion-item">
                  <h2
                    className="accordion-header"
                    id="panelsStayOpen-headingPackagedFood"
                  >
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#panelsStayOpen-collapseheadingPackagedFood"
                      aria-expanded="false"
                      aria-controls="panelsStayOpen-collapseheadingPackagedFood"
                    >
                      Packaged Food
                    </button>
                  </h2>
                  <div
                    id="panelsStayOpen-collapseheadingPackagedFood"
                    className="accordion-collapse collapse"
                    aria-labelledby="panelsStayOpen-headingPackagedFood"
                  >
                    <div id="packaged_food" className="accordion-body">
                      {packagedFoodFilters.map((filter, index) => (
                        <li key={filter.ID} className="product_filters">
                          <label
                            className="product_filters_label"
                            title={
                              filter.PopUpInfoIconDescription || filter.OneLiner
                            }
                          >
                            <input
                              className="form-check-input rest me-1"
                              type="checkbox"
                              value={String(index + 1)}
                              onChange={handlePackagedFoodChange}
                              checked={
                                formdata.packaged_food &&
                                formdata.packaged_food.includes(
                                  String(index + 1)
                                )
                              }
                            />
                            {filter.SubCategory}
                          </label>
                          <FilterDescriptionFunction id={filter.ID} />
                        </li>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Cosmetics */}
                <div className="accordion-item">
                  <h2
                    className="accordion-header"
                    id="panelsStayOpen-headingCosmetics"
                  >
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#panelsStayOpen-collapseheadingCosmetics"
                      aria-expanded="false"
                      aria-controls="panelsStayOpen-collapseheadingCosmetics"
                    >
                      Cosmetics
                    </button>
                  </h2>
                  <div
                    id="panelsStayOpen-collapseheadingCosmetics"
                    className="accordion-collapse collapse"
                    aria-labelledby="panelsStayOpen-headingCosmetics"
                  >
                    <div id="cosmetics" className="accordion-body">
                      {cosmeticsFilters.map((filter, index) => (
                        <li key={filter.ID} className="product_filters">
                          <label
                            className="product_filters_label"
                            title={
                              filter.PopUpInfoIconDescription || filter.OneLiner
                            }
                          >
                            <input
                              className="form-check-input rest me-1"
                              type="checkbox"
                              value={String(index + 1)}
                              onChange={handleCosmeticsChange}
                              checked={
                                formdata.cosmetics &&
                                formdata.cosmetics.includes(String(index + 1))
                              }
                            />
                            {filter.SubCategory}
                          </label>
                          <FilterDescriptionFunction id={filter.ID} />
                        </li>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fashion & Apparel */}
          <div className="accordion-item">
            <h2
              className="accordion-header"
              id="panelsStayOpen-headingFashionApparel"
            >
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#panelsStayOpen-collapseheadingFashionApparel"
                aria-expanded="false"
                aria-controls="panelsStayOpen-collapseheadingFashionApparel"
              >
                Fashion & Apparel
              </button>
            </h2>
            <div
              id="panelsStayOpen-collapseheadingFashionApparel"
              className="accordion-collapse collapse"
              aria-labelledby="panelsStayOpen-headingFashionApparel"
            >
              <div className="accordion-body">
                <div className="accordion-item">
                  <h2
                    className="accordion-header"
                    id="panelsStayOpen-headingPurchasePriceCategory"
                  >
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#panelsStayOpen-collapseheadingPurchasePriceCategory"
                      aria-expanded="false"
                      aria-controls="panelsStayOpen-collapseheadingPurchasePriceCategory"
                    >
                      Purchase Price Category
                    </button>
                  </h2>
                  <div
                    id="panelsStayOpen-collapseheadingPurchasePriceCategory"
                    className="accordion-collapse collapse"
                    aria-labelledby="panelsStayOpen-headingPurchasePriceCategory"
                  >
                    <div id="fashion" className="accordion-body">
                      {fashionFilters.map((filter, index) => (
                        <li key={filter.ID} className="product_filters">
                          <label
                            className="product_filters_label"
                            title={
                              filter.PopUpInfoIconDescription || filter.OneLiner
                            }
                          >
                            <input
                              className="form-check-input rest me-1"
                              type="checkbox"
                              value={String(index + 1)}
                              onChange={handleFashionChange}
                              checked={
                                formdata.fashion &&
                                formdata.fashion.includes(String(index + 1))
                              }
                            />
                            {filter.SubCategory}
                          </label>
                          <FilterDescriptionFunction id={filter.ID} />
                        </li>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Travel */}
          <div className="accordion-item">
            <h2 className="accordion-header" id="panelsStayOpen-headingTravel">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#panelsStayOpen-collapseheadingTravel"
                aria-expanded="false"
                aria-controls="panelsStayOpen-collapseheadingTravel"
              >
                Travel
              </button>
            </h2>
            <div
              id="panelsStayOpen-collapseheadingTravel"
              className="accordion-collapse collapse"
              aria-labelledby="panelsStayOpen-headingTravel"
            >
              <div className="accordion-body">
                <p className="accordion-title">
                  {travelShortFilters[0]?.FilterDescription}
                </p>

                {/* Short Term Holidays */}
                <div className="accordion-item">
                  <h2
                    className="accordion-header"
                    id="panelsStayOpen-headingShortTermHolidays"
                  >
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#panelsStayOpen-collapseheadingShortTermHolidays"
                      aria-expanded="false"
                      aria-controls="panelsStayOpen-collapseheadingShortTermHolidays"
                    >
                      Short Term Holidays
                    </button>
                  </h2>
                  <div
                    id="panelsStayOpen-collapseheadingShortTermHolidays"
                    className="accordion-collapse collapse"
                    aria-labelledby="panelsStayOpen-headingShortTermHolidays"
                  >
                    <div id="travel_spend" className="accordion-body">
                      {travelShortFilters.map((filter, index) => {
                        const valueMap = ["1","2"];
                        return (
                          <li key={filter.ID} className="product_filters">
                            <label
                              className="product_filters_label"
                              title={
                                filter.PopUpInfoIconDescription ||
                                filter.OneLiner
                              }
                            >
                              <input
                                className="form-check-input rest me-1"
                                type="checkbox"
                                value={valueMap[index]}
                                onChange={handleTravelSpendChange}
                                checked={
                                  formdata.travel_spend &&
                                  formdata.travel_spend.includes(
                                    valueMap[index]
                                  )
                                }
                              />
                              {filter.SubCategory}
                            </label>
                            <FilterDescriptionFunction id={filter.ID} />
                          </li>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Long Term Holidays */}
                <div className="accordion-item">
                  <h2
                    className="accordion-header"
                    id="panelsStayOpen-headingLongTermHolidays"
                  >
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#panelsStayOpen-collapseheadingLongTermHolidays"
                      aria-expanded="false"
                      aria-controls="panelsStayOpen-collapseheadingLongTermHolidays"
                    >
                      Long Term Holidays
                    </button>
                  </h2>
                  <div
                    id="panelsStayOpen-collapseheadingLongTermHolidays"
                    className="accordion-collapse collapse"
                    aria-labelledby="panelsStayOpen-headingLongTermHolidays"
                  >
                    <div id="travel_destination" className="accordion-body">
                      {travelLongFilters.map((filter, index) => {
                        const valueMap = [
                          "1",
                          // "national",
                          // "international",
                          // "travel_destination_special",
                        ];
                        return (
                          <li key={filter.ID} className="product_filters">
                            <label
                              className="product_filters_label"
                              title={
                                filter.PopUpInfoIconDescription ||
                                filter.OneLiner
                              }
                            >
                              <input
                                className="form-check-input rest me-1"
                                type="checkbox"
                                value={valueMap[index]}
                                onChange={handleTravelDestinationChange}
                                checked={
                                  formdata.travel_destination &&
                                  formdata.travel_destination.includes(
                                    valueMap[index]
                                  )
                                }
                              />
                              {filter.SubCategory ||
                                "Long Term Holidays (Special)"}
                            </label>
                            <FilterDescriptionFunction id={filter.ID} />
                          </li>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Retail */}
          <div className="accordion-item">
            <h2 className="accordion-header" id="panelsStayOpen-headingRetail">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#panelsStayOpen-collapseheadingRetail"
                aria-expanded="false"
                aria-controls="panelsStayOpen-collapseheadingRetail"
              >
                Retail
              </button>
            </h2>
            <div
              id="panelsStayOpen-collapseheadingRetail"
              className="accordion-collapse collapse"
              aria-labelledby="panelsStayOpen-headingRetail"
            >
              <div className="accordion-body">
                {/* Online Shopping */}
                <div className="accordion-item">
                  <h2
                    className="accordion-header"
                    id="panelsStayOpen-headingOnlineShoping"
                  >
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#panelsStayOpen-collapseheadingOnlineShoping"
                      aria-expanded="false"
                      aria-controls="panelsStayOpen-collapseheadingOnlineShoping"
                    >
                      Online Shopping
                    </button>
                  </h2>
                  <div
                    id="panelsStayOpen-collapseheadingOnlineShoping"
                    className="accordion-collapse collapse"
                    aria-labelledby="panelsStayOpen-headingOnlineShoping"
                  >
                    <div id="retail" className="accordion-body">
                      {onlineRetailFilters.map((filter, index) => {
                        const valueMap = ["1", "2", "3"];
                        return (
                          <li key={filter.ID} className="product_filters solo">
                            <label
                              className="product_filters_label"
                              title={
                                filter.PopUpInfoIconDescription ||
                                filter.OneLiner
                              }
                            >
                              <input
                                className="form-check-input rest me-1"
                                type="checkbox"
                                value={valueMap[index]}
                                onChange={handleOnlineRetailChange}
                                checked={
                                  formdata.online_retail &&
                                  formdata.online_retail.includes(
                                    valueMap[index]
                                  )
                                }
                              />
                              {filter.SubCategory ||
                                `Expected ${valueMap[index]} / ${
                                  valueMap[index] === "rare"
                                    ? "Irregular"
                                    : valueMap[index] === "moderate"
                                    ? "Average"
                                    : "Frequent"
                                } Use`}
                            </label>
                            <FilterDescriptionFunction id={filter.ID} />
                          </li>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Home and Living */}
                {/* <div className="accordion-item">
                  <h2
                    className="accordion-header"
                    id="panelsStayOpen-headingHomeAndLiving"
                  >
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#panelsStayOpen-collapseheadingHomeAndLiving"
                      aria-expanded="false"
                      aria-controls="panelsStayOpen-collapseheadingHomeAndLiving"
                    >
                      Home and Living
                    </button>
                  </h2>
                  <div
                    id="panelsStayOpen-collapseheadingHomeAndLiving"
                    className="accordion-collapse collapse"
                    aria-labelledby="panelsStayOpen-headingHomeAndLiving"
                  >
                    <div id="retail" className="accordion-body">
                      {homeAndLivingFilters.map((filter, index) => {
                        const valueMap = ["high_priced", "moderately_priced"];
                        return (
                          <li key={filter.ID} className="product_filters">
                            <label
                              className="product_filters_label"
                              title={
                                filter.PopUpInfoIconDescription ||
                                filter.OneLiner
                              }
                            >
                              <input
                                className="form-check-input rest me-1"
                                type="checkbox"
                                value={valueMap[index]}
                                checked={
                                  formdata.retail &&
                                  formdata.retail.includes(valueMap[index])
                                }
                                onChange={handleRetailChange}
                              />
                              {filter.SubCategory}
                            </label>
                            <FilterDescriptionFunction id={filter.ID} />
                          </li>
                        );
                      })}
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>

          {/* Real Estate */}
          <div className="accordion-item">
            <h2
              className="accordion-header"
              id="panelsStayOpen-headingRealEstate"
            >
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#panelsStayOpen-collapseheadingRealEstate"
                aria-expanded="false"
                aria-controls="panelsStayOpen-collapseheadingRealEstate"
              >
                Real Estate
              </button>
            </h2>
            <div
              id="panelsStayOpen-collapseheadingRealEstate"
              className="accordion-collapse collapse"
              aria-labelledby="panelsStayOpen-headingRealEstate"
            >
              <div id="real_estate" className="accordion-body">
                <p className="accordion-title">
                  {realEstateFilters[0]?.FilterDescription}
                </p>
                {realEstateFilters.map((filter, index) => (
                  <li key={filter.ID} className="product_filters">
                    <label
                      className="product_filters_label"
                      title={filter.PopUpInfoIconDescription || filter.OneLiner}
                    >
                      <input
                        className="form-check-input rest me-1"
                        type="checkbox"
                        value={String(index + 1)}
                        onChange={handleRealEstateChange}
                        checked={
                          formdata.real_estate &&
                          formdata.real_estate.includes(String(index + 1))
                        }
                      />
                      {filter.Category}
                    </label>
                    <FilterDescriptionFunction id={filter.ID} />
                  </li>
                ))}
              </div>
            </div>
          </div>

          {/* Jewellery & Gold */}
          <div className="accordion-item">
            <h2
              className="accordion-header"
              id="panelsStayOpen-headingJewelleryGold"
            >
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#panelsStayOpen-collapseheadingJewelleryGold"
                aria-expanded="false"
                aria-controls="panelsStayOpen-collapseheadingJewelleryGold"
              >
                Jewellery & Gold
              </button>
            </h2>
            <div
              id="panelsStayOpen-collapseheadingJewelleryGold"
              className="accordion-collapse collapse"
              aria-labelledby="panelsStayOpen-headingJewelleryGold"
            >
              <div className="accordion-body">
                <p className="accordion-title">
                  {jewelleryGoldFilters[0]?.FilterDescription}
                </p>

                {/* Category: Total */}
                {/* <div className="accordion-item">
                  <h2
                    className="accordion-header"
                    id="panelsStayOpen-headingCategoryTotal"
                  >
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#panelsStayOpen-collapseheadingCategoryTotal"
                      aria-expanded="false"
                      aria-controls="panelsStayOpen-collapseheadingCategoryTotal"
                    >
                      Category: Total
                    </button>
                  </h2>
                  <div
                    id="panelsStayOpen-collapseheadingCategoryTotal"
                    className="accordion-collapse collapse"
                    aria-labelledby="panelsStayOpen-headingCategoryTotal"
                  >
                    <div id="jewellery_total" className="accordion-body">
                      {jewelleryTotalFilters.map((filter, index) => {
                        const valueMap = ["branded", "traditional"];
                        return (
                          <li key={filter.ID} className="product_filters">
                            <label
                              className="product_filters_label"
                              title={
                                filter.PopUpInfoIconDescription ||
                                filter.OneLiner
                              }
                            >
                              <input
                                className="form-check-input rest me-1"
                                type="checkbox"
                                value={valueMap[index]}
                                checked={
                                  formdata.jewellery_total &&
                                  formdata.jewellery_total.includes(
                                    valueMap[index]
                                  )
                                }
                                onChange={handleJewelleryTotalChange}
                              />
                              {filter.SubCategory}
                            </label>
                            <FilterDescriptionFunction id={filter.ID} />
                          </li>
                        );
                      })}
                    </div>
                  </div>
                </div> */}

                {/* Category: Gold */}
                <div className="accordion-item">
                  <h2
                    className="accordion-header"
                    id="panelsStayOpen-headingCategoryGold"
                  >
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#panelsStayOpen-collapseheadingCategoryGold"
                      aria-expanded="false"
                      aria-controls="panelsStayOpen-collapseheadingCategoryGold"
                    >
                      Category: Gold
                    </button>
                  </h2>
                  <div
                    id="panelsStayOpen-collapseheadingCategoryGold"
                    className="accordion-collapse collapse"
                    aria-labelledby="panelsStayOpen-headingCategoryGold"
                  >
                    <div id="jewellery_gold" className="accordion-body">
                      {jewelleryGoldFilters.map((filter, index) => {
                        const valueMap = ["1","2"];
                        return (
                          <li key={filter.ID} className="product_filters">
                            <label
                              className="product_filters_label"
                              title={
                                filter.PopUpInfoIconDescription ||
                                filter.OneLiner
                              }
                            >
                              <input
                                className="form-check-input rest me-1"
                                type="checkbox"
                                value={valueMap[index]}
                                onChange={handleJewelleryGoldChange}
                                checked={
                                  formdata.jewellery_gold &&
                                  formdata.jewellery_gold.includes(
                                    valueMap[index]
                                  )
                                }
                              />
                              {filter.SubCategory}
                            </label>
                            <FilterDescriptionFunction id={filter.ID} />
                          </li>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Category: Diamond */}
                <div className="accordion-item">
                  <h2
                    className="accordion-header"
                    id="panelsStayOpen-headingCategoryDiamond"
                  >
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#panelsStayOpen-collapseheadingCategoryDiamond"
                      aria-expanded="false"
                      aria-controls="panelsStayOpen-collapseheadingCategoryDiamond"
                    >
                      Category: Diamond
                    </button>
                  </h2>
                  <div
                    id="panelsStayOpen-collapseheadingCategoryDiamond"
                    className="accordion-collapse collapse"
                    aria-labelledby="panelsStayOpen-headingCategoryDiamond"
                  >
                    <div id="jewellery_diamond" className="accordion-body">
                      {jewelleryDiamondFilters.map((filter, index) => {
                        const valueMap = ["1","2"];
                        return (
                          <li key={filter.ID} className="product_filters">
                            <label
                              className="product_filters_label"
                              title={
                                filter.PopUpInfoIconDescription ||
                                filter.OneLiner
                              }
                            >
                              <input
                                className="form-check-input rest me-1"
                                type="checkbox"
                                value={valueMap[index]}
                                onChange={handleJewelleryDiamondChange}
                                checked={
                                  formdata.jewellery_diamond &&
                                  formdata.jewellery_diamond.includes(
                                    valueMap[index]
                                  )
                                }
                              />
                              {filter.SubCategory}
                            </label>
                            <FilterDescriptionFunction id={filter.ID} />
                          </li>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Electronics */}
          {/* Electronics */}
          <div className="accordion-item">
            <h2
              className="accordion-header"
              id="panelsStayOpen-headingElectronics"
            >
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#panelsStayOpen-collapseheadingElectronics"
                aria-expanded="false"
                aria-controls="panelsStayOpen-collapseheadingElectronics"
              >
                Electronics Segmentation
              </button>
            </h2>
            <div
              id="panelsStayOpen-collapseheadingElectronics"
              className="accordion-collapse collapse"
              aria-labelledby="panelsStayOpen-headingElectronics"
            >
              <div className="accordion-body">
                <p className="accordion-title">
                  {electronicsTVFilters[0]?.FilterDescription}
                </p>

                {/* Category: TV */}
                <div className="accordion-item">
                  <h2
                    className="accordion-header"
                    id="panelsStayOpen-headingCategoryTV"
                  >
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#panelsStayOpen-collapseheadingCategoryTV"
                      aria-expanded="false"
                      aria-controls="panelsStayOpen-collapseheadingCategoryTV"
                    >
                      TV
                    </button>
                  </h2>
                  <div
                    id="panelsStayOpen-collapseheadingCategoryTV"
                    className="accordion-collapse collapse"
                    aria-labelledby="panelsStayOpen-headingCategoryTV"
                  >
                    <div id="tv" className="accordion-body">
                      {electronicsTVFilters.map((filter, index) => {
                        const valueMap = ["1","2"];
                        return (
                          <li key={filter.ID} className="product_filters">
                            <label
                              className="product_filters_label"
                              title={
                                filter.PopUpInfoIconDescription ||
                                filter.OneLiner
                              }
                            >
                              <input
                                className="form-check-input rest me-1"
                                type="checkbox"
                                value={valueMap[index]}
                                checked={
                                  formdata.TV &&
                                  formdata.TV.includes(valueMap[index])
                                }
                                onChange={handleTVChange}
                              />
                              {filter.SubCategory}
                            </label>
                            <FilterDescriptionFunction id={filter.ID} />
                          </li>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Category: Smartphone */}
                <div className="accordion-item">
                  <h2
                    className="accordion-header"
                    id="panelsStayOpen-headingCategorySmartphone"
                  >
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#panelsStayOpen-collapseheadingCategorySmartphone"
                      aria-expanded="false"
                      aria-controls="panelsStayOpen-collapseheadingCategorySmartphone"
                    >
                      Smartphone
                    </button>
                  </h2>
                  <div
                    id="panelsStayOpen-collapseheadingCategorySmartphone"
                    className="accordion-collapse collapse"
                    aria-labelledby="panelsStayOpen-headingCategorySmartphone"
                  >
                    <div id="smartphone" className="accordion-body">
                      {electronicsSmartphoneFilters.map((filter, index) => {
                        const valueMap = ["1","2"];
                        return (
                          <li key={filter.ID} className="product_filters">
                            <label
                              className="product_filters_label"
                              title={
                                filter.PopUpInfoIconDescription ||
                                filter.OneLiner
                              }
                            >
                              <input
                                className="form-check-input rest me-1"
                                type="checkbox"
                                value={valueMap[index]}
                                checked={
                                  formdata.Smartphone &&
                                  formdata.Smartphone.includes(valueMap[index])
                                }
                                onChange={handleSmartphoneChange}
                              />
                              {filter.SubCategory}
                            </label>
                            <FilterDescriptionFunction id={filter.ID} />
                          </li>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Category: Refrigerator */}
                <div className="accordion-item">
                  <h2
                    className="accordion-header"
                    id="panelsStayOpen-headingCategoryRefrigerator"
                  >
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#panelsStayOpen-collapseheadingCategoryRefrigerator"
                      aria-expanded="false"
                      aria-controls="panelsStayOpen-collapseheadingCategoryRefrigerator"
                    >
                      Refrigerator
                    </button>
                  </h2>
                  <div
                    id="panelsStayOpen-collapseheadingCategoryRefrigerator"
                    className="accordion-collapse collapse"
                    aria-labelledby="panelsStayOpen-headingCategoryRefrigerator"
                  >
                    <div id="refrigerator" className="accordion-body">
                      {electronicsRefrigeratorFilters.map((filter, index) => {
                        const valueMap = ["1","2"];
                        return (
                          <li key={filter.ID} className="product_filters">
                            <label
                              className="product_filters_label"
                              title={
                                filter.PopUpInfoIconDescription ||
                                filter.OneLiner
                              }
                            >
                              <input
                                className="form-check-input rest me-1"
                                type="checkbox"
                                value={valueMap[index]}
                                checked={
                                  formdata.Refrigerator &&
                                  formdata.Refrigerator.includes(
                                    valueMap[index]
                                  )
                                }
                                onChange={handleRefrigeratorChange}
                              />
                              {filter.SubCategory}
                            </label>
                            <FilterDescriptionFunction id={filter.ID} />
                          </li>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Category: Washing Machine */}
                <div className="accordion-item">
                  <h2
                    className="accordion-header"
                    id="panelsStayOpen-headingCategoryWashingMachine"
                  >
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#panelsStayOpen-collapseheadingCategoryWashingMachine"
                      aria-expanded="false"
                      aria-controls="panelsStayOpen-collapseheadingCategoryWashingMachine"
                    >
                      Washing Machine
                    </button>
                  </h2>
                  <div
                    id="panelsStayOpen-collapseheadingCategoryWashingMachine"
                    className="accordion-collapse collapse"
                    aria-labelledby="panelsStayOpen-headingCategoryWashingMachine"
                  >
                    <div id="washing_machine" className="accordion-body">
                      {electronicsWashingMachineFilters.map((filter, index) => {
                        const valueMap = ["1","2"];
                        return (
                          <li key={filter.ID} className="product_filters">
                            <label
                              className="product_filters_label"
                              title={
                                filter.PopUpInfoIconDescription ||
                                filter.OneLiner
                              }
                            >
                              <input
                                className="form-check-input rest me-1"
                                type="checkbox"
                                value={valueMap[index]}
                                checked={
                                  formdata.WashingMachine &&
                                  formdata.WashingMachine.includes(
                                    valueMap[index]
                                  )
                                }
                                onChange={handleWashingMachineChange}
                              />
                              {filter.SubCategory}
                            </label>
                            <FilterDescriptionFunction id={filter.ID} />
                          </li>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Category: Air Conditioner */}
                <div className="accordion-item">
                  <h2
                    className="accordion-header"
                    id="panelsStayOpen-headingCategoryAirConditioner"
                  >
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#panelsStayOpen-collapseheadingCategoryAirConditioner"
                      aria-expanded="false"
                      aria-controls="panelsStayOpen-collapseheadingCategoryAirConditioner"
                    >
                      Air Conditioner
                    </button>
                  </h2>
                  <div
                    id="panelsStayOpen-collapseheadingCategoryAirConditioner"
                    className="accordion-collapse collapse"
                    aria-labelledby="panelsStayOpen-headingCategoryAirConditioner"
                  >
                    <div id="air_conditioner" className="accordion-body">
                      {electronicsAirConditionerFilters.map((filter, index) => {
                        const valueMap = ["1","2"];
                        return (
                          <li key={filter.ID} className="product_filters">
                            <label
                              className="product_filters_label"
                              title={
                                filter.PopUpInfoIconDescription ||
                                filter.OneLiner
                              }
                            >
                              <input
                                className="form-check-input rest me-1"
                                type="checkbox"
                                value={valueMap[index]}
                                checked={
                                  formdata.AirConditioner &&
                                  formdata.AirConditioner.includes(
                                    valueMap[index]
                                  )
                                }
                                onChange={handleAirConditionerChange}
                              />
                              {filter.SubCategory}
                            </label>
                            <FilterDescriptionFunction id={filter.ID} />
                          </li>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for popup */}
      <div
        className="modal fade"
        id="filterDescription"
        tabIndex="-1"
        aria-labelledby="filterDescriptionLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <PopupContent selectedId={selectedId} />
        </div>
      </div>
    </>
  );
};

export default KentrixFiltersPage;
