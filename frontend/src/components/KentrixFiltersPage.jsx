import React, { useState } from 'react';
import { BsInfo } from 'react-icons/bs';

import { KentrixFiltersDescription } from '../data/KentrixFiltersDescription';
import { MdDelete } from 'react-icons/md';

const KentrixFiltersPage = ({
    formdata,
    user,
    handleCityChange,
    handleIncomeChange,
    handleRegionTypeChange,
    handleLifestyleChange,
    handleSecReferenceChange,
    handleSmallerTownsChange,
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

    setPresetName,
    presetName,
    setDeletePresetName,
    deletePresetName,
    handleTimeEstimate,
    handleKentrixSolo,
    handleReachEstimate,
    handleReset,
    handleSavePreset,
    handleCreateCampaign,
    presetsData,
    handleDeletePreset,
    time_estimate_data,
    reachedEstimationSolo,
    campaign_name,
    setCampaign_name,
    campaign_objective,
    setCampaign_objective,
    commandStatus,
    handlePresetSelection,
    isLoading,
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
                formattedNumber.unshift(',');
            }
        }

        return formattedNumber.join('');
    }



    const [selectedId, setSelectedId] = useState(null);


    const FilterDescriptionFunction = ({ id }) => {
        const filterDescription = KentrixFiltersDescription.find(
            (item) => item.ID === id
        );

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
                        >
                            <BsInfo />
                        </button>
                    )}
                </p>
            </div>
        );
    };



    const PopupContent = ({ selectedId }) => {
        const filterDescription = KentrixFiltersDescription.find(
            (item) => item.ID === selectedId
        );
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
                            <strong> {filterDescription?.['Group']} &gt; {filterDescription?.['Category']} &gt; {filterDescription?.['SubCategory']}
                            </strong>
                        </label>
                        <p>{filterDescription?.['PopUpInfoIconDescription']}</p>
                    </div>
                </div>
            </div>
        );
    };






    return (
        <>
            <div className="filter_container">
                <div className="accordion">
                    <div className="accordion-item">
                        <h2 className="accordion-header" id="panelsStayOpen-headingCityName">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseheadingCityName" aria-expanded="false" aria-controls="panelsStayOpen-collapseheadingCityName">
                                City Name
                            </button>
                        </h2>
                        <div id="panelsStayOpen-collapseheadingCityName" className="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingCityName">
                            <div className="accordion-body">
                                {user && (
                                    user.selectedCities.map((city) => (
                                        <li className="product_filters" key={city.id}>
                                            <label className='product_filters_label'>
                                                <input
                                                    className="form-check-input rest me-1"
                                                    type="radio"
                                                    value={city.CityValue}
                                                    onChange={handleCityChange}
                                                    checked={formdata.city_name && formdata.city_name.includes(city.CityValue)}
                                                />
                                                {city.CityName}
                                            </label>
                                        </li>
                                    ))

                                )}

                            </div>
                        </div>
                    </div>
                    <div className="accordion-item">
                        <h2 className="accordion-header" id="panelsStayOpen-headingIncome">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseheadingIncome" aria-expanded="false" aria-controls="panelsStayOpen-collapseheadingIncome">
                                Socio-Economic Profile (Income)
                            </button>
                        </h2>
                        <div id="panelsStayOpen-collapseheadingIncome" className="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingIncome">
                            <div id="income" className="accordion-body">
                                <p>Demographic information such as Affluence and income are provided in these segments.</p>
                                <li className="product_filters">
                                    <label className='product_filters_label'>
                                        <input
                                            className="form-check-input rest me-1"
                                            type="checkbox"
                                            value="1"
                                            checked={formdata.income && formdata.income.includes("1")}
                                            onChange={handleIncomeChange}
                                        />
                                        {'01: INR < 40,000'}
                                    </label>
                                    <FilterDescriptionFunction id={1} />
                                </li>

                                <li className="product_filters">
                                    <label className='product_filters_label'>
                                        <input
                                            className="form-check-input rest me-1"
                                            type="checkbox"
                                            value="2"
                                            checked={formdata.income && formdata.income.includes("2")}
                                            onChange={handleIncomeChange}
                                        />
                                        {'02: INR 40,000 - 80,000'}
                                    </label>
                                    <FilterDescriptionFunction id={2} />



                                </li>
                                <li className="product_filters">
                                    <label className='product_filters_label'>
                                        <input
                                            className="form-check-input rest me-1"
                                            type="checkbox"
                                            value="3"
                                            checked={formdata.income && formdata.income.includes("3")}
                                            onChange={handleIncomeChange}
                                        />
                                        {'03: INR 80,000 - 1,70,000'}
                                    </label>
                                    <FilterDescriptionFunction id={3} />
                                </li>
                                <li className="product_filters">
                                    <label className='product_filters_label'>
                                        <input
                                            className="form-check-input rest me-1"
                                            type="checkbox"
                                            value="4"
                                            checked={formdata.income && formdata.income.includes("4")}
                                            onChange={handleIncomeChange}
                                        />
                                        {'04: INR 1,70,000 - 3,00,000'}
                                    </label>
                                    <FilterDescriptionFunction id={4} />



                                </li>
                                <li className="product_filters">
                                    <label className='product_filters_label'>
                                        <input
                                            className="form-check-input rest me-1"
                                            type="checkbox"
                                            value="5"
                                            checked={formdata.income && formdata.income.includes("5")}
                                            onChange={handleIncomeChange}
                                        />
                                        {'05: INR >3,00,000'}
                                    </label>
                                    <FilterDescriptionFunction id={5} />
                                </li>
                            </div>

                        </div>
                    </div>

                    {/* <div className="accordion-item">
                        <h2 className="accordion-header" id="panelsStayOpen-headingRegiotype">
                            <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#panelsStayOpen-collapseheadingRegiotype"
                                aria-expanded="false"
                                aria-controls="panelsStayOpen-collapseheadingRegiotype"
                            >
                                Regio-type
                            </button>
                        </h2>
                        <div id="panelsStayOpen-collapseheadingRegiotype"
                            className="accordion-collapse collapse"
                            aria-labelledby="panelsStayOpen-headingRegiotype">
                            <div className="accordion-body">
                                <div className="accordion-item">
                                    <h2
                                        className="accordion-header"
                                        id="panelsStayOpen-headingRTUrban"
                                    >
                                        <button
                                            className="accordion-button collapsed"
                                            type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#panelsStayOpen-collapseheadingRTUrban"
                                            aria-expanded="false"
                                            aria-controls="panelsStayOpen-collapseheadingRTUrban"
                                        >
                                            Urban
                                        </button>
                                    </h2>

                                    <div
                                        id="panelsStayOpen-collapseheadingRTUrban"
                                        className="accordion-collapse collapse"
                                        aria-labelledby="panelsStayOpen-headingRTUrban"
                                    >
                                        <div id="regio_type" className="accordion-body">
                                            <p>This audience category contains information like the region type.</p>
                                            <li className="product_filters">
                                                <label className='product_filters_label'>
                                                    <input
                                                        className="form-check-input rest me-1"
                                                        type="checkbox"
                                                        value="1"
                                                        checked={formdata.regio_type && formdata.regio_type.includes("1")}
                                                        onChange={handleRegionTypeChange}
                                                    />
                                                    Cosmopolitan Urban Area
                                                </label>
                                            </li>
                                            <li className="product_filters">
                                                <label className='product_filters_label'>
                                                    <input
                                                        className="form-check-input rest me-1"
                                                        type="checkbox"
                                                        value="2"
                                                        checked={formdata.regio_type && formdata.regio_type.includes("2")}
                                                        onChange={handleRegionTypeChange}
                                                    />
                                                    Sub-Metropolitan Urban Area
                                                </label>
                                            </li>
                                            <li className="product_filters">
                                                <label className='product_filters_label'>
                                                    <input
                                                        className="form-check-input rest me-1"
                                                        type="checkbox"
                                                        value="3"
                                                        checked={formdata.regio_type && formdata.regio_type.includes("3")}
                                                        onChange={handleRegionTypeChange}
                                                    />
                                                    Small Urban Area
                                                </label>
                                            </li>
                                            <li className="product_filters">
                                                <label className='product_filters_label'>
                                                    <input
                                                        className="form-check-input rest me-1"
                                                        type="checkbox"
                                                        value="4"
                                                        checked={formdata.regio_type && formdata.regio_type.includes("4")}
                                                        onChange={handleRegionTypeChange}
                                                    />
                                                    Semi Urban Area
                                                </label>
                                            </li>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> */}

                    <div className="accordion-item">
                        <h2
                            className="accordion-header"
                            id="panelsStayOpen-headingConsumerSegments"
                        >
                            <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#panelsStayOpen-collapseheadingConsumerSegments"
                                aria-expanded="false"
                                aria-controls="panelsStayOpen-collapseheadingConsumerSegments"
                            >
                                Consumer Segments
                            </button>
                        </h2>
                        <div
                            id="panelsStayOpen-collapseheadingConsumerSegments"
                            className="accordion-collapse collapse"
                            aria-labelledby="panelsStayOpen-headingConsumerSegments"
                        >
                            <div className="accordion-body">
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
                                            Lifestyle
                                        </button>
                                    </h2>
                                    <div
                                        id="panelsStayOpen-collapseheadingLifestyle"
                                        className="accordion-collapse collapse"
                                        aria-labelledby="panelsStayOpen-headingLifestyle"
                                    >
                                        <div id="lifestyle" className="accordion-body">
                                            <p>Segments the population into different categories based on demographic information and consumption habits like consumption and social status.</p>
                                            <li className="product_filters">
                                                <label className='product_filters_label'>
                                                    <input
                                                        className="form-check-input rest me-1"
                                                        type="checkbox"
                                                        value="1"
                                                        onChange={handleLifestyleChange}
                                                        checked={formdata.lifestyle && formdata.lifestyle.includes("1")}

                                                    />
                                                    Urban Established Elite
                                                </label>
                                                <FilterDescriptionFunction id={6} />
                                            </li>
                                            <li className="product_filters">
                                                <label className='product_filters_label'>
                                                    <input
                                                        className="form-check-input rest me-1"
                                                        type="checkbox"
                                                        value="2"
                                                        onChange={handleLifestyleChange}
                                                        checked={formdata.lifestyle && formdata.lifestyle.includes("2")}
                                                    />
                                                    Urban New Wealth
                                                </label>
                                                <FilterDescriptionFunction id={7} />
                                            </li>
                                            <li className="product_filters">
                                                <label className='product_filters_label'>
                                                    <input
                                                        className="form-check-input rest me-1"
                                                        type="checkbox"
                                                        value="3"
                                                        onChange={handleLifestyleChange}
                                                        checked={formdata.lifestyle && formdata.lifestyle.includes("3")}
                                                    />
                                                    Aspiring Urban Middle Class
                                                </label>
                                                <FilterDescriptionFunction id={8} />
                                            </li>
                                            <li className="product_filters">
                                                <label className='product_filters_label'>
                                                    <input
                                                        className="form-check-input rest me-1"
                                                        type="checkbox"
                                                        value="4"
                                                        onChange={handleLifestyleChange}
                                                        checked={formdata.lifestyle && formdata.lifestyle.includes("4")}
                                                    />
                                                    Conservative Urban Middle Class
                                                </label>
                                                <FilterDescriptionFunction id={9} />
                                            </li>
                                            <li className="product_filters">
                                                <label className='product_filters_label'>
                                                    <input
                                                        className="form-check-input rest me-1"
                                                        type="checkbox"
                                                        value="5"
                                                        onChange={handleLifestyleChange}
                                                        checked={formdata.lifestyle && formdata.lifestyle.includes("5")}
                                                    />
                                                    Lower Middle Class
                                                </label>
                                                <FilterDescriptionFunction id={10} />
                                            </li>
                                            <li className="product_filters">
                                                <label className='product_filters_label'>
                                                    <input
                                                        className="form-check-input rest me-1"
                                                        type="checkbox"
                                                        value="6"
                                                        onChange={handleLifestyleChange}
                                                        checked={formdata.lifestyle && formdata.lifestyle.includes("6")}
                                                    />
                                                    Lower Class
                                                </label>
                                                <FilterDescriptionFunction id={11} />
                                            </li>
                                        </div>
                                    </div>
                                </div>

                                <div className="accordion-item">
                                    <h2
                                        className="accordion-header"
                                        id="panelsStayOpen-headingSECReference"
                                    >
                                        <button
                                            className="accordion-button collapsed"
                                            type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#panelsStayOpen-collapseheadingSECReference"
                                            aria-expanded="false"
                                            aria-controls="panelsStayOpen-collapseheadingSECReference"
                                        >
                                            NCCS Reference
                                        </button>
                                    </h2>
                                    <div
                                        id="panelsStayOpen-collapseheadingSECReference"
                                        className="accordion-collapse collapse"
                                        aria-labelledby="panelsStayOpen-headingSECReference"
                                    >
                                        <div id="sec_reference" className="accordion-body">
                                            <li className="product_filters">
                                                <label className='product_filters_label'>
                                                    <input
                                                        className="form-check-input rest me-1"
                                                        type="checkbox"
                                                        value="1"
                                                        checked={formdata.sec_reference && formdata.sec_reference.includes("1")}
                                                        onChange={handleSecReferenceChange}
                                                    />
                                                    NCCS A1
                                                </label>
                                                <FilterDescriptionFunction id={12} />
                                            </li>
                                            <li className="product_filters">
                                                <label className='product_filters_label'>
                                                    <input
                                                        className="form-check-input rest me-1"
                                                        type="checkbox"
                                                        value="2"
                                                        checked={formdata.sec_reference && formdata.sec_reference.includes("2")}
                                                        onChange={handleSecReferenceChange}
                                                    />
                                                    NCCS A2
                                                </label>
                                                <FilterDescriptionFunction id={13} />
                                            </li>
                                            <li className="product_filters">
                                                <label className='product_filters_label'>
                                                    <input
                                                        className="form-check-input rest me-1"
                                                        type="checkbox"
                                                        value="3"
                                                        checked={formdata.sec_reference && formdata.sec_reference.includes("3")}
                                                        onChange={handleSecReferenceChange}
                                                    />
                                                    NCCS A3
                                                </label>
                                                <FilterDescriptionFunction id={14} />
                                            </li>
                                            <li className="product_filters">
                                                <label className='product_filters_label'>
                                                    <input
                                                        className="form-check-input rest me-1"
                                                        type="checkbox"
                                                        value="4"
                                                        checked={formdata.sec_reference && formdata.sec_reference.includes("4")}
                                                        onChange={handleSecReferenceChange}
                                                    />
                                                    NCCS B1
                                                </label>
                                                <FilterDescriptionFunction id={15} />
                                            </li>
                                            <li className="product_filters">
                                                <label className='product_filters_label'>
                                                    <input
                                                        className="form-check-input rest me-1"
                                                        type="checkbox"
                                                        value="5"
                                                        checked={formdata.sec_reference && formdata.sec_reference.includes("5")}
                                                        onChange={handleSecReferenceChange}
                                                    />
                                                    NCCS B2
                                                </label>
                                                <FilterDescriptionFunction id={16} />
                                            </li>
                                            <li className="product_filters">
                                                <label className='product_filters_label'>
                                                    <input
                                                        className="form-check-input rest me-1"
                                                        type="checkbox"
                                                        value="6"
                                                        checked={formdata.sec_reference && formdata.sec_reference.includes("6")}
                                                        onChange={handleSecReferenceChange}
                                                    />
                                                    NCCS C1
                                                </label>
                                                <FilterDescriptionFunction id={17} />
                                            </li>
                                            <li className="product_filters">
                                                <label className='product_filters_label'>
                                                    <input
                                                        className="form-check-input rest me-1"
                                                        type="checkbox"
                                                        value="7"
                                                        checked={formdata.sec_reference && formdata.sec_reference.includes("7")}
                                                        onChange={handleSecReferenceChange}
                                                    />
                                                    NCCS C2
                                                </label>
                                                <FilterDescriptionFunction id={18} />
                                            </li>
                                            <li className="product_filters">
                                                <label className='product_filters_label'>
                                                    <input
                                                        className="form-check-input rest me-1"
                                                        type="checkbox"
                                                        value="8"
                                                        checked={formdata.sec_reference && formdata.sec_reference.includes("8")}
                                                        onChange={handleSecReferenceChange}
                                                    />
                                                    NCCS D1
                                                </label>
                                                <FilterDescriptionFunction id={19} />
                                            </li>
                                            <li className="product_filters">
                                                <label className='product_filters_label'>
                                                    <input
                                                        className="form-check-input rest me-1"
                                                        type="checkbox"
                                                        value="9"
                                                        checked={formdata.sec_reference && formdata.sec_reference.includes("9")}
                                                        onChange={handleSecReferenceChange}
                                                    />
                                                    NCCS D2
                                                </label>
                                                <FilterDescriptionFunction id={20} />
                                            </li>
                                            <li className="product_filters">
                                                <label className='product_filters_label'>
                                                    <input
                                                        className="form-check-input rest me-1"
                                                        type="checkbox"
                                                        value="10"
                                                        checked={formdata.sec_reference && formdata.sec_reference.includes("10")}
                                                        onChange={handleSecReferenceChange}
                                                    />
                                                    NCCS E1
                                                </label>
                                                <FilterDescriptionFunction id={21} />
                                            </li>
                                            <li className="product_filters">
                                                <label className='product_filters_label'>
                                                    <input
                                                        className="form-check-input rest me-1"
                                                        type="checkbox"
                                                        value="11"
                                                        checked={formdata.sec_reference && formdata.sec_reference.includes("11")}
                                                        onChange={handleSecReferenceChange}
                                                    />
                                                    NCCS E2
                                                </label>
                                                <FilterDescriptionFunction id={22} />
                                            </li>
                                            <li className="product_filters">
                                                <label className='product_filters_label'>
                                                    <input
                                                        className="form-check-input rest me-1"
                                                        type="checkbox"
                                                        value="12"
                                                        checked={formdata.sec_reference && formdata.sec_reference.includes("12")}
                                                        onChange={handleSecReferenceChange}
                                                    />
                                                    NCCS E3
                                                </label>
                                                <FilterDescriptionFunction id={23} />
                                            </li>
                                        </div>
                                    </div>
                                </div>

                                {/* <div className="accordion-item">
                                    <h2
                                        className="accordion-header"
                                        id="panelsStayOpen-headingSmallerTowns"
                                    >
                                        <button
                                            className="accordion-button collapsed"
                                            type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#panelsStayOpen-collapseheadingSmallerTowns"
                                            aria-expanded="false"
                                            aria-controls="panelsStayOpen-collapseheadingSmallerTowns"
                                        >
                                            Lifestyle (Smaller Towns)
                                        </button>
                                    </h2>
                                    <div
                                        id="panelsStayOpen-collapseheadingSmallerTowns"
                                        className="accordion-collapse collapse"
                                        aria-labelledby="panelsStayOpen-headingSmallerTowns"
                                    >
                                        <div id="smaller_towns" className="accordion-body">
                                            <li className="product_filters">
                                                <label className='product_filters_label'>
                                                    <input
                                                        className="form-check-input rest me-1"
                                                        type="checkbox"
                                                        value="1"
                                                        checked={formdata.smaller_towns && formdata.smaller_towns.includes("1")}
                                                        onChange={handleSmallerTownsChange}
                                                    />
                                                    Successful Elite In Smaller Towns
                                                </label>
                                            </li>
                                            <li className="product_filters">
                                                <label className='product_filters_label'>
                                                    <input
                                                        className="form-check-input rest me-1"
                                                        type="checkbox"
                                                        value="2"
                                                        checked={formdata.smaller_towns && formdata.smaller_towns.includes("2")}
                                                        onChange={handleSmallerTownsChange}
                                                    />
                                                    Urban Middle Class In Smaller Towns
                                                </label>
                                            </li>
                                            <li className="product_filters">
                                                <label className='product_filters_label'>
                                                    <input
                                                        className="form-check-input rest me-1"
                                                        type="checkbox"
                                                        value="3"
                                                        checked={formdata.smaller_towns && formdata.smaller_towns.includes("3")}
                                                        onChange={handleSmallerTownsChange}
                                                    />
                                                    Savvy And Steady Urban Climbers In Smaller Towns
                                                </label>
                                            </li>
                                        </div>
                                    </div>
                                </div> */}

                                <div className="accordion-item">
                                    <h2
                                        className="accordion-header"
                                        id="panelsStayOpen-headingSpecialHealthCareTargetGroup"
                                    >
                                        <button
                                            className="accordion-button collapsed"
                                            type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#panelsStayOpen-collapseheadingSpecialHealthCareTargetGroup"
                                            aria-expanded="false"
                                            aria-controls="panelsStayOpen-collapseheadingSpecialHealthCareTargetGroup"
                                        >
                                            Special Health Care Target Group
                                        </button>
                                    </h2>
                                    <div
                                        id="panelsStayOpen-collapseheadingSpecialHealthCareTargetGroup"
                                        className="accordion-collapse collapse"
                                        aria-labelledby="panelsStayOpen-headingSpecialHealthCareTargetGroup"
                                    >
                                        <div id="health_care" className="accordion-body">
                                            <li className="product_filters">
                                                <label className='product_filters_label'>
                                                    <input
                                                        className="form-check-input rest me-1"
                                                        type="checkbox"
                                                        value="1"
                                                        checked={formdata.health_care && formdata.health_care.includes("1")}
                                                        onChange={handleHealthCareChange}
                                                    />
                                                    Health Care - 'The Informed' In Urban India
                                                </label>
                                                <FilterDescriptionFunction id={24} />
                                            </li>
                                            <li className="product_filters">
                                                <label className='product_filters_label'>
                                                    <input
                                                        className="form-check-input rest me-1"
                                                        type="checkbox"
                                                        value="2"
                                                        checked={formdata.health_care && formdata.health_care.includes("2")}
                                                        onChange={handleHealthCareChange}
                                                    />
                                                    Health Care - 'The Carefree / Anxious' In Urban India
                                                </label>
                                                <FilterDescriptionFunction id={25} />
                                            </li>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="accordion-item">
                        <h2 className="accordion-header" id="panelsStayOpen-headingAutomobile">
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
                                <p>Consumers who are likely to own varying types of motor vehicles as well as the affinity to buy cars in a specific price range.</p>
                                <li className="product_filters">
                                    <label className='product_filters_label'>
                                        <input
                                            className="form-check-input rest me-1"
                                            type="checkbox"
                                            value="automobile_1"
                                            onChange={handleAutomobileChange}
                                            checked={formdata.automobile && formdata.automobile.includes("automobile_1")}
                                        />
                                        Entry Price - Segment INR 2,00,000 - 4,50,000
                                    </label>
                                    <FilterDescriptionFunction id={35} />
                                </li>
                                <li className="product_filters">
                                    <label className='product_filters_label'>
                                        <input
                                            className="form-check-input rest me-1"
                                            type="checkbox"
                                            value="automobile_2"
                                            onChange={handleAutomobileChange}
                                            checked={formdata.automobile && formdata.automobile.includes("automobile_2")}
                                        />
                                        Entry Premium Hatch Segment INR 4,00,000 - 7,00,000
                                    </label>
                                    <FilterDescriptionFunction id={36} />
                                </li>
                                <li className="product_filters">
                                    <label className='product_filters_label'>
                                        <input
                                            className="form-check-input rest me-1"
                                            type="checkbox"
                                            value="automobile_3"
                                            onChange={handleAutomobileChange}
                                            checked={formdata.automobile && formdata.automobile.includes("automobile_3")}
                                        />
                                        Premium Hatch Segment INR 5,50,000 - 9,00,000
                                    </label>
                                    <FilterDescriptionFunction id={37} />
                                </li>
                                <li className="product_filters">
                                    <label className='product_filters_label'>
                                        <input
                                            className="form-check-input rest me-1"
                                            type="checkbox"
                                            value="automobile_4"
                                            onChange={handleAutomobileChange}
                                            checked={formdata.automobile && formdata.automobile.includes("automobile_4")}
                                        />
                                        Compact Sedan Segment INR 5,30,000 - 8,50,000
                                    </label>
                                    <FilterDescriptionFunction id={38} />
                                </li>
                                <li className="product_filters">
                                    <label className='product_filters_label'>
                                        <input
                                            className="form-check-input rest me-1"
                                            type="checkbox"
                                            value="automobile_5"
                                            onChange={handleAutomobileChange}
                                            checked={formdata.automobile && formdata.automobile.includes("automobile_5")}
                                        />
                                        Sedan Segment INR 8,00,000 - 13,00,000
                                    </label>
                                    <FilterDescriptionFunction id={39} />
                                </li>
                                <li className="product_filters">
                                    <label className='product_filters_label'>
                                        <input
                                            className="form-check-input rest me-1"
                                            type="checkbox"
                                            value="automobile_6"
                                            onChange={handleAutomobileChange}
                                            checked={formdata.automobile && formdata.automobile.includes("automobile_6")}
                                        />
                                        Premium Sedan Segment INR 13,00,000 - 20,00,000
                                    </label>
                                    <FilterDescriptionFunction id={40} />
                                </li>
                                <li className="product_filters">
                                    <label className='product_filters_label'>
                                        <input
                                            className="form-check-input rest me-1"
                                            type="checkbox"
                                            value="automobile_7"
                                            onChange={handleAutomobileChange}
                                            checked={formdata.automobile && formdata.automobile.includes("automobile_7")}
                                        />
                                        Compact / Entry SUV Segment INR 9,00,000 - 14,00,000
                                    </label>
                                    <FilterDescriptionFunction id={41} />
                                </li>
                                <li className="product_filters">
                                    <label className='product_filters_label'>
                                        <input
                                            className="form-check-input rest me-1"
                                            type="checkbox"
                                            value="automobile_8"
                                            onChange={handleAutomobileChange}
                                            checked={formdata.automobile && formdata.automobile.includes("automobile_8")}
                                        />
                                        SUV Segment INR 15,00,000 - 30,00,000
                                    </label>
                                    <FilterDescriptionFunction id={42} />
                                </li>
                                <li className="product_filters">
                                    <label className='product_filters_label'>
                                        <input
                                            className="form-check-input rest me-1"
                                            type="checkbox"
                                            value="automobile_9"
                                            onChange={handleAutomobileChange}
                                            checked={formdata.automobile && formdata.automobile.includes("automobile_9")}
                                        />
                                        Luxury Premium Sedan & SUV Segment INR 25,00,000+
                                    </label>
                                    <FilterDescriptionFunction id={43} />
                                </li>
                                <li className="product_filters">
                                    <label className='product_filters_label'>
                                        <input
                                            className="form-check-input rest me-1"
                                            type="checkbox"
                                            value="automobile_10"
                                            onChange={handleAutomobileChange}
                                            checked={formdata.automobile && formdata.automobile.includes("automobile_10")}
                                        />
                                        Second-hand Sedan Segment{" "}
                                    </label>
                                    <FilterDescriptionFunction id={44} />
                                </li>
                                <li className="product_filters">
                                    <label className='product_filters_label'>
                                        <input
                                            className="form-check-input rest me-1"
                                            type="checkbox"
                                            value="automobile_11"
                                            onChange={handleAutomobileChange}
                                            checked={formdata.automobile && formdata.automobile.includes("automobile_11")}
                                        />
                                        Second-hand Premium Sedan / SUV Segment
                                    </label>
                                    <FilterDescriptionFunction id={45} />
                                </li>
                                <li className="product_filters">
                                    <label className='product_filters_label'>
                                        <input
                                            className="form-check-input rest me-1"
                                            type="checkbox"
                                            value="automobile_12"
                                            onChange={handleAutomobileChange}
                                            checked={formdata.automobile && formdata.automobile.includes("automobile_12")}
                                        />
                                        Second-hand Luxury Premium Sedan & SUV Segment
                                    </label>
                                    <FilterDescriptionFunction id={46} />
                                </li>
                            </div>
                        </div>
                    </div>

                    <div className="accordion-item">
                        <h2 className="accordion-header" id="panelsStayOpen-headingTwoWheeler">
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
                                <p>Consumers who are likely to own varying types of Two Wheelers as well as the affinity to buy in a specific price range.</p>
                                <li className="product_filters">
                                    <label className='product_filters_label'>
                                        <input
                                            className="form-check-input rest me-1"
                                            type="checkbox"
                                            value="two_wheeler_1"
                                            onChange={handleTwoWheelerChange}
                                            checked={formdata.two_wheeler && formdata.two_wheeler.includes("two_wheeler_1")}

                                        />
                                        Entry Level Scooter Segment
                                    </label>
                                    <FilterDescriptionFunction id={82} />
                                </li>
                                <li className="product_filters">
                                    <label className='product_filters_label'>
                                        <input
                                            className="form-check-input rest me-1"
                                            type="checkbox"
                                            value="two_wheeler_2"
                                            onChange={handleTwoWheelerChange}
                                            checked={formdata.two_wheeler && formdata.two_wheeler.includes("two_wheeler_2")}


                                        />
                                        Premium Scooter Segment
                                    </label>
                                    <FilterDescriptionFunction id={83} />
                                </li>
                                <li className="product_filters">
                                    <label className='product_filters_label'>
                                        <input
                                            className="form-check-input rest me-1"
                                            type="checkbox"
                                            value="two_wheeler_3"
                                            onChange={handleTwoWheelerChange}
                                            checked={formdata.two_wheeler && formdata.two_wheeler.includes("two_wheeler_3")}

                                        />
                                        Entry Level Commuter Segment
                                    </label>
                                    <FilterDescriptionFunction id={84} />
                                </li>
                                <li className="product_filters">
                                    <label className='product_filters_label'>
                                        <input
                                            className="form-check-input rest me-1"
                                            type="checkbox"
                                            value="two_wheeler_4"
                                            onChange={handleTwoWheelerChange}
                                            checked={formdata.two_wheeler && formdata.two_wheeler.includes("two_wheeler_4")}

                                        />
                                        Premium Commuter Segment
                                    </label>
                                    <FilterDescriptionFunction id={85} />
                                </li>
                                <li className="product_filters">
                                    <label className='product_filters_label'>
                                        <input
                                            className="form-check-input rest me-1"
                                            type="checkbox"
                                            value="two_wheeler_5"
                                            onChange={handleTwoWheelerChange}
                                            checked={formdata.two_wheeler && formdata.two_wheeler.includes("two_wheeler_5")}

                                        />
                                        Entry Level Sports Bike Segment
                                    </label>
                                    <FilterDescriptionFunction id={86} />
                                </li>
                                <li className="product_filters">
                                    <label className='product_filters_label'>
                                        <input
                                            className="form-check-input rest me-1"
                                            type="checkbox"
                                            value="two_wheeler_6"
                                            onChange={handleTwoWheelerChange}
                                            checked={formdata.two_wheeler && formdata.two_wheeler.includes("two_wheeler_6")}

                                        />
                                        Premium Sports Bike Segment
                                    </label>
                                    <FilterDescriptionFunction id={87} />
                                </li>
                                <li className="product_filters">
                                    <label className='product_filters_label'>
                                        <input
                                            className="form-check-input rest me-1"
                                            type="checkbox"
                                            value="two_wheeler_7"
                                            onChange={handleTwoWheelerChange}
                                            checked={formdata.two_wheeler && formdata.two_wheeler.includes("two_wheeler_7")}

                                        />
                                        Entry Level Cruiser Bike Segment
                                    </label>
                                    <FilterDescriptionFunction id={88} />
                                </li>
                                <li className="product_filters">
                                    <label className='product_filters_label'>
                                        <input
                                            className="form-check-input rest me-1"
                                            type="checkbox"
                                            value="two_wheeler_8"
                                            onChange={handleTwoWheelerChange}
                                            checked={formdata.two_wheeler && formdata.two_wheeler.includes("two_wheeler_8")}

                                        />
                                        Premium Cruiser Bike Segment
                                    </label>
                                    <FilterDescriptionFunction id={89} />
                                </li>
                                <li className="product_filters">
                                    <label className='product_filters_label'>
                                        <input
                                            className="form-check-input rest me-1"
                                            type="checkbox"
                                            value="two_wheeler_9"
                                            onChange={handleTwoWheelerChange}
                                            checked={formdata.two_wheeler && formdata.two_wheeler.includes("two_wheeler_9")}

                                        />
                                        Touring Bike Segment
                                    </label>
                                    <FilterDescriptionFunction id={90} />
                                </li>
                                <li className="product_filters">
                                    <label className='product_filters_label'>
                                        <input
                                            className="form-check-input rest me-1"
                                            type="checkbox"
                                            value="two_wheeler_10"
                                            onChange={handleTwoWheelerChange}
                                            checked={formdata.two_wheeler && formdata.two_wheeler.includes("two_wheeler_10")}

                                        />
                                        Off Road Bike Segment
                                    </label>
                                    <FilterDescriptionFunction id={91} />
                                </li>
                            </div>
                        </div>
                    </div>

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
                                <p>This audience category contains information about individual’s Financial Services such as credit card holders.</p>
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
                                            <li className="product_filters">
                                                <label className='product_filters_label'>
                                                    <input
                                                        className="form-check-input rest me-1"
                                                        type="checkbox"
                                                        value="insurance_saving_plan"
                                                        onChange={handleInsuranceChange}
                                                        checked={formdata.insurance && formdata.insurance.includes("insurance_saving_plan")}
                                                    />
                                                    Insurance: Saving Plan
                                                </label>
                                                <FilterDescriptionFunction id={26} />
                                            </li>
                                            <li className="product_filters">
                                                <label className='product_filters_label'>
                                                    <input
                                                        className="form-check-input rest me-1"
                                                        type="checkbox"
                                                        value="insurance_retirement_plan"
                                                        checked={formdata.insurance && formdata.insurance.includes("insurance_retirement_plan")}
                                                        onChange={handleInsuranceChange}
                                                    />
                                                    Insurance: Retirement Plan
                                                </label>
                                                <FilterDescriptionFunction id={27} />
                                            </li>
                                            <li className="product_filters">
                                                <label className='product_filters_label'>
                                                    <input
                                                        className="form-check-input rest me-1"
                                                        type="checkbox"
                                                        value="insurance_unit_linked_plan"
                                                        checked={formdata.insurance && formdata.insurance.includes("insurance_unit_linked_plan")}
                                                        onChange={handleInsuranceChange}
                                                    />
                                                    Insurance: Unit Linked Plan
                                                </label>
                                                <FilterDescriptionFunction id={28} />
                                            </li>
                                            <li className="product_filters">
                                                <label className='product_filters_label'>
                                                    <input
                                                        className="form-check-input rest me-1"
                                                        type="checkbox"
                                                        value="insurance_health"
                                                        onChange={handleInsuranceChange}
                                                        checked={formdata.insurance && formdata.insurance.includes("insurance_health")}
                                                    />
                                                    Insurance: Health Plan
                                                </label>
                                                <FilterDescriptionFunction id={29} />
                                            </li>
                                        </div>
                                    </div>
                                </div>

                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="panelsStayOpen-headingBanking">
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
                                                        <li className="product_filters">
                                                            <label className='product_filters_label'>
                                                                <input
                                                                    className="form-check-input rest me-1"
                                                                    type="checkbox"
                                                                    value="banking_product_mutual_fund"
                                                                    onChange={handleBankingProductChange}
                                                                    checked={formdata.banking_product && formdata.banking_product.includes("banking_product_mutual_fund")}
                                                                />
                                                                Banking: Mutual Fund
                                                            </label>
                                                            <FilterDescriptionFunction id={30} />
                                                        </li>
                                                        <li className="product_filters">
                                                            <label className='product_filters_label'>
                                                                <input
                                                                    className="form-check-input rest me-1"
                                                                    type="checkbox"
                                                                    value="banking_product_fixed_deposit"
                                                                    onChange={handleBankingProductChange}
                                                                    checked={formdata.banking_product && formdata.banking_product.includes("banking_product_fixed_deposit")}
                                                                />
                                                                Banking: Fixed Deposit
                                                            </label>
                                                            <FilterDescriptionFunction id={31} />
                                                        </li>
                                                    </div>
                                                </div>
                                            </div>

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
                                                        <li className="product_filters">
                                                            <label className='product_filters_label'>
                                                                <input
                                                                    className="form-check-input rest me-1"
                                                                    type="checkbox"
                                                                    value="1"
                                                                    onChange={handleCreditCardChange}
                                                                    checked={formdata.credit_card && formdata.credit_card.includes("1")}

                                                                />
                                                                Expected rare / Irregular Use
                                                            </label>
                                                            <FilterDescriptionFunction id={32} />
                                                        </li>
                                                        <li className="product_filters">
                                                            <label className='product_filters_label'>
                                                                <input
                                                                    className="form-check-input rest me-1"
                                                                    type="checkbox"
                                                                    value="2"
                                                                    checked={formdata.credit_card && formdata.credit_card.includes("2")}
                                                                    onChange={handleCreditCardChange}
                                                                />
                                                                Expected Moderate / Average Use
                                                            </label>
                                                            <FilterDescriptionFunction id={33} />
                                                        </li>
                                                        <li className="product_filters">
                                                            <label className='product_filters_label'>
                                                                <input
                                                                    className="form-check-input rest me-1"
                                                                    type="checkbox"
                                                                    value="3"
                                                                    checked={formdata.credit_card && formdata.credit_card.includes("3")}
                                                                    onChange={handleCreditCardChange}
                                                                />
                                                                Expected heavy / Frequent Use
                                                            </label>
                                                            <FilterDescriptionFunction id={34} />
                                                        </li>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>




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
                                <p>Consumers who are likely to purchase goods across various product categories including Food, Personal Wash, Beauty, Home and Living.</p>
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="panelsStayOpen-headingLaundry">
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
                                            <li className="product_filters">
                                                <label className='product_filters_label'>
                                                    <input
                                                        className="form-check-input rest me-1"
                                                        type="checkbox"
                                                        value="1"
                                                        onChange={handleLaundryChange}
                                                        checked={formdata.laundry && formdata.laundry.includes("1")}

                                                    />
                                                    Fabric Wash Products: Mass Classified
                                                </label>
                                                <FilterDescriptionFunction id={52} />
                                            </li>
                                            <li className="product_filters">
                                                <label className='product_filters_label'>
                                                    <input
                                                        className="form-check-input rest me-1"
                                                        type="checkbox"
                                                        value="2"
                                                        onChange={handleLaundryChange}
                                                        checked={formdata.laundry && formdata.laundry.includes("2")}
                                                    />
                                                    Fabric Wash Products: Premium Classified
                                                </label>
                                                <FilterDescriptionFunction id={53} />
                                            </li>
                                            <li className="product_filters">
                                                <label className='product_filters_label'>
                                                    <input
                                                        className="form-check-input rest me-1"
                                                        type="checkbox"
                                                        id="laundry_washing_machine"
                                                        value="laundry_washing_machine"
                                                        onChange={handleLaundryChange}
                                                        checked={formdata.laundry && formdata.laundry.includes("laundry_washing_machine")}
                                                    />
                                                    Washing Machine Products
                                                </label>
                                                <FilterDescriptionFunction id={54} />
                                            </li>
                                        </div>
                                    </div>
                                </div>

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
                                            <li className="product_filters">
                                                <label className='product_filters_label'>
                                                    <input
                                                        className="form-check-input rest me-1"
                                                        type="checkbox"
                                                        value="1"
                                                        onChange={handlePersonalWashChange}
                                                        checked={formdata.personal_wash && formdata.personal_wash.includes("1")}
                                                    />
                                                    Mass Classified Products
                                                </label>
                                                <FilterDescriptionFunction id={55} />
                                            </li>
                                            <li className="product_filters">
                                                <label className='product_filters_label'>
                                                    <input
                                                        className="form-check-input rest me-1"
                                                        type="checkbox"
                                                        value="2"
                                                        onChange={handlePersonalWashChange}
                                                        checked={formdata.personal_wash && formdata.personal_wash.includes("2")}
                                                    />
                                                    Popular Classified Products
                                                </label>
                                                <FilterDescriptionFunction id={56} />
                                            </li>
                                            <li className="product_filters">
                                                <label className='product_filters_label'>
                                                    <input
                                                        className="form-check-input rest me-1"
                                                        type="checkbox"
                                                        value="3"
                                                        onChange={handlePersonalWashChange}
                                                        checked={formdata.personal_wash && formdata.personal_wash.includes("3")}
                                                    />
                                                    Premium Classified Products
                                                </label>
                                                <FilterDescriptionFunction id={57} />
                                            </li>
                                        </div>
                                    </div>
                                </div>

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
                                            <li className="product_filters">
                                                <label className='product_filters_label'>
                                                    <input
                                                        className="form-check-input rest me-1"
                                                        type="checkbox"
                                                        value="1"
                                                        onChange={handlePackagedFoodChange}
                                                        checked={formdata.packaged_food && formdata.packaged_food.includes("1")}
                                                    />
                                                    Mass Classified Products
                                                </label>
                                                <FilterDescriptionFunction id={58} />
                                            </li>
                                            <li className="product_filters">
                                                <label className='product_filters_label'>
                                                    <input
                                                        className="form-check-input rest me-1"
                                                        type="checkbox"
                                                        value="2"
                                                        onChange={handlePackagedFoodChange}
                                                        checked={formdata.packaged_food && formdata.packaged_food.includes("2")}
                                                    />
                                                    Popular Classified Products
                                                </label>
                                                <FilterDescriptionFunction id={95} />
                                            </li>
                                            <li className="product_filters">
                                                <label className='product_filters_label'>
                                                    <input
                                                        className="form-check-input rest me-1"
                                                        type="checkbox"
                                                        value="3"
                                                        onChange={handlePackagedFoodChange}
                                                        checked={formdata.packaged_food && formdata.packaged_food.includes("3")}
                                                    />
                                                    Premium Classified Products
                                                </label>
                                                <FilterDescriptionFunction id={59} />
                                            </li>
                                        </div>
                                    </div>
                                </div>

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
                                            <li className="product_filters">
                                                <label className='product_filters_label'>
                                                    <input
                                                        className="form-check-input rest me-1"
                                                        type="checkbox"
                                                        value="1"
                                                        onChange={handleCosmeticsChange}
                                                        checked={formdata.cosmetics && formdata.cosmetics.includes("1")}
                                                    />
                                                    Mass Classified Products
                                                </label>
                                                <FilterDescriptionFunction id={60} />
                                            </li>
                                            <li className="product_filters">
                                                <label className='product_filters_label'>
                                                    <input
                                                        className="form-check-input rest me-1"
                                                        type="checkbox"
                                                        value="2"
                                                        onChange={handleCosmeticsChange}
                                                        checked={formdata.cosmetics && formdata.cosmetics.includes("2")}
                                                    />
                                                    Popular Classified Products
                                                </label>
                                                <FilterDescriptionFunction id={61} />
                                            </li>
                                            <li className="product_filters">
                                                <label className='product_filters_label'>
                                                    <input
                                                        className="form-check-input rest me-1"
                                                        type="checkbox"
                                                        value="3"
                                                        onChange={handleCosmeticsChange}
                                                        checked={formdata.cosmetics && formdata.cosmetics.includes("3")}
                                                    />
                                                    Premium Classified Products
                                                </label>
                                                <FilterDescriptionFunction id={62} />
                                            </li>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

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
                                            <li className="product_filters">
                                                <label className='product_filters_label'>
                                                    <input
                                                        className="form-check-input rest me-1"
                                                        type="checkbox"
                                                        value="1"
                                                        onChange={handleFashionChange}
                                                        checked={formdata.fashion && formdata.fashion.includes("1")}
                                                    />
                                                    Economy (typically INR Below 800)
                                                </label>
                                                <FilterDescriptionFunction id={63} />
                                            </li>
                                            <li className="product_filters">
                                                <label className='product_filters_label'>
                                                    <input
                                                        className="form-check-input rest me-1"
                                                        type="checkbox"
                                                        value="2"
                                                        onChange={handleFashionChange}
                                                        checked={formdata.fashion && formdata.fashion.includes("2")}
                                                    />
                                                    Medium (typically INR 800 - 2,000)
                                                </label>
                                                <FilterDescriptionFunction id={64} />
                                            </li>
                                            <li className="product_filters">
                                                <label className='product_filters_label'>
                                                    <input
                                                        className="form-check-input rest me-1"
                                                        type="checkbox"
                                                        value="3"
                                                        onChange={handleFashionChange}
                                                        checked={formdata.fashion && formdata.fashion.includes("3")}
                                                    />
                                                    Premium (typically INR 2,000 - 3,500)
                                                </label>
                                                <FilterDescriptionFunction id={65} />
                                            </li>
                                            <li className="product_filters">
                                                <label className='product_filters_label'>
                                                    <input
                                                        className="form-check-input rest me-1"
                                                        type="checkbox"
                                                        value="4"
                                                        onChange={handleFashionChange}
                                                        checked={formdata.fashion && formdata.fashion.includes("4")}
                                                    />
                                                    Super Premium (typically INR 3,500 - 7,000)
                                                </label>
                                                <FilterDescriptionFunction id={66} />
                                            </li>
                                            <li className="product_filters">
                                                <label className='product_filters_label'>
                                                    <input
                                                        className="form-check-input rest me-1"
                                                        type="checkbox"
                                                        value="5"
                                                        onChange={handleFashionChange}
                                                        checked={formdata.fashion && formdata.fashion.includes("5")}
                                                    />
                                                    Luxury (typically INR 7,000+)
                                                </label>
                                                <FilterDescriptionFunction id={67} />
                                            </li>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

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
                                <p>Consumers who are likely to travel are part of these segments. Information about their travel habits, like destination and spending, is provided.</p>
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
                                            <li className="product_filters">
                                                <label className='product_filters_label'>
                                                    <input
                                                        className="form-check-input rest me-1"
                                                        type="checkbox"
                                                        value="basic"
                                                        onChange={handleTravelSpendChange}
                                                        checked={formdata.travel_spend && formdata.travel_spend.includes("basic")}

                                                    />
                                                    Category typically 'Basic'
                                                </label>
                                                <FilterDescriptionFunction id={74} />
                                            </li>
                                            <li className="product_filters">
                                                <label className='product_filters_label'>
                                                    <input
                                                        className="form-check-input rest me-1"
                                                        type="checkbox"
                                                        value="luxury"
                                                        onChange={handleTravelSpendChange}
                                                        checked={formdata.travel_spend && formdata.travel_spend.includes("luxury")}
                                                    />
                                                    Category typically 'Luxury'
                                                </label>
                                                <FilterDescriptionFunction id={75} />
                                            </li>
                                        </div>
                                    </div>
                                </div>

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
                                            <li className="product_filters">
                                                <label className='product_filters_label'>
                                                    <input
                                                        className="form-check-input rest me-1"
                                                        type="checkbox"
                                                        value="national"
                                                        onChange={handleTravelDestinationChange}
                                                        checked={formdata.travel_destination && formdata.travel_destination.includes("national")}

                                                    />
                                                    Destination typically 'National'
                                                </label>
                                                <FilterDescriptionFunction id={76} />
                                            </li>
                                            <li className="product_filters">
                                                <label className='product_filters_label'>
                                                    <input
                                                        className="form-check-input rest me-1"
                                                        type="checkbox"
                                                        value="international"
                                                        onChange={handleTravelDestinationChange}
                                                        checked={formdata.travel_destination && formdata.travel_destination.includes("international")}

                                                    />
                                                    Destination typically 'International'
                                                </label>
                                                <FilterDescriptionFunction id={77} />
                                            </li>
                                            <li className="product_filters">
                                                <label className='product_filters_label'>
                                                    <input
                                                        className="form-check-input rest me-1"
                                                        type="checkbox"
                                                        value="travel_destination_special"
                                                        id="travel_destination_special"
                                                        onChange={handleTravelDestinationChange}
                                                        checked={formdata.travel_destination && formdata.travel_destination.includes("travel_destination_special")}


                                                    />
                                                    Long Term Holidays (Special)
                                                </label>
                                                <FilterDescriptionFunction id={78} />
                                            </li>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
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
                                            <li className="product_filters solo">
                                                <label className='product_filters_label'>
                                                    <input
                                                        className="form-check-input rest me-1"
                                                        type="checkbox"
                                                        value="rare"
                                                        onChange={handleOnlineRetailChange}
                                                        checked={formdata.online_retail && formdata.online_retail.includes("rare")}


                                                    />
                                                    Expected Rare / Irregular Use
                                                </label>
                                                <FilterDescriptionFunction id={92} />
                                            </li>
                                            <li className="product_filters solo">
                                                <label className='product_filters_label'>
                                                    <input
                                                        className="form-check-input rest me-1"
                                                        type="checkbox"
                                                        value="moderate"
                                                        onChange={handleOnlineRetailChange}
                                                        checked={formdata.online_retail && formdata.online_retail.includes("moderate")}


                                                    />
                                                    Expected Moderate / Average Use
                                                </label>
                                                <FilterDescriptionFunction id={93} />
                                            </li>
                                            <li className="product_filters solo">
                                                <label className='product_filters_label'>
                                                    <input
                                                        className="form-check-input rest me-1"
                                                        type="checkbox"
                                                        value="heavy"
                                                        onChange={handleOnlineRetailChange}
                                                        checked={formdata.online_retail && formdata.online_retail.includes("heavy")}


                                                    />
                                                    Expected Heavy / Frequent Use
                                                </label>
                                                <FilterDescriptionFunction id={94} />
                                            </li>
                                        </div>
                                    </div>
                                </div>

                                <div className="accordion-item">
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
                                            <li className="product_filters">
                                                <label className='product_filters_label'>
                                                    <input
                                                        className="form-check-input rest me-1"
                                                        type="checkbox"
                                                        value="high_priced"
                                                        checked={formdata.retail && formdata.retail.includes("high_priced")}
                                                        onChange={handleRetailChange}
                                                    />
                                                    Typically 'High Priced' Purchases
                                                </label>
                                                <FilterDescriptionFunction id={80} />
                                            </li>
                                            <li className="product_filters">
                                                <label className='product_filters_label'>
                                                    <input
                                                        className="form-check-input rest me-1"
                                                        type="checkbox"
                                                        value="moderately_priced"
                                                        onChange={handleRetailChange}
                                                        checked={formdata.retail && formdata.retail.includes("moderately_priced")}
                                                    />
                                                    Typically 'Moderate Priced' Purchases
                                                </label>
                                                <FilterDescriptionFunction id={81} />
                                            </li>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="accordion-item">
                        <h2 className="accordion-header" id="panelsStayOpen-headingRealEstate">
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
                                <p>This audience category contains information about Home and Property ownership as well as expenditures for it.</p>
                                <li className="product_filters">
                                    <label className='product_filters_label'>
                                        <input
                                            className="form-check-input rest me-1"
                                            type="checkbox"
                                            value="1"
                                            onChange={handleRealEstateChange}
                                            checked={formdata.real_estate && formdata.real_estate.includes("1")}
                                        />
                                        Purchase Price Segment: INR 15,00,000 - 25,00,000
                                    </label>
                                    <FilterDescriptionFunction id={47} />
                                </li>
                                <li className="product_filters">
                                    <label className='product_filters_label'>
                                        <input
                                            className="form-check-input rest me-1"
                                            type="checkbox"
                                            value="2"
                                            onChange={handleRealEstateChange}
                                            checked={formdata.real_estate && formdata.real_estate.includes("2")}
                                        />
                                        Purchase Price Segment: INR 25,00,000 - 50,00,000
                                    </label>
                                    <FilterDescriptionFunction id={48} />
                                </li>
                                <li className="product_filters">
                                    <label className='product_filters_label'>
                                        <input
                                            className="form-check-input rest me-1"
                                            type="checkbox"
                                            value="3"
                                            onChange={handleRealEstateChange}
                                            checked={formdata.real_estate && formdata.real_estate.includes("3")}
                                        />
                                        Purchase Price Segment: INR 51,00,000 - 1 Crore
                                    </label>
                                    <FilterDescriptionFunction id={49} />
                                </li>
                                <li className="product_filters">
                                    <label className='product_filters_label'>
                                        <input
                                            className="form-check-input rest me-1"
                                            type="checkbox"
                                            value="4"
                                            onChange={handleRealEstateChange}
                                            checked={formdata.real_estate && formdata.real_estate.includes("4")}
                                        />
                                        Purchase Price Segment: INR 1 - 4 Crore
                                    </label>
                                    <FilterDescriptionFunction id={50} />
                                </li>
                                <li className="product_filters">
                                    <label className='product_filters_label'>
                                        <input
                                            className="form-check-input rest me-1"
                                            type="checkbox"
                                            value="5"
                                            onChange={handleRealEstateChange}
                                            checked={formdata.real_estate && formdata.real_estate.includes("5")}
                                        />
                                        Purchase Price Segment: Beyond INR 4 Crore
                                    </label>
                                    <FilterDescriptionFunction id={51} />
                                </li>
                            </div>
                        </div>
                    </div>



                    <div className="accordion-item">
                        <h2 className="accordion-header" id="panelsStayOpen-headingJewelleryGold">
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
                                <p>Consumers who are likely to purchase goods across various product categories including Gold and Jewellery.</p>
                                <div className="accordion-item">
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
                                            <li className="product_filters">
                                                <label className='product_filters_label'>
                                                    <input
                                                        className="form-check-input rest me-1"
                                                        type="checkbox"
                                                        value="branded"
                                                        checked={formdata.jewellery_total && formdata.jewellery_total.includes("branded")}
                                                        onChange={handleJewelleryTotalChange}
                                                    />
                                                    Branded Jewellery
                                                </label>
                                                <FilterDescriptionFunction id={68} />
                                            </li>
                                            <li className="product_filters">
                                                <label className='product_filters_label'>
                                                    <input
                                                        className="form-check-input rest me-1"
                                                        type="checkbox"
                                                        value="traditional"
                                                        onChange={handleJewelleryTotalChange}
                                                        checked={formdata.jewellery_total && formdata.jewellery_total.includes("traditional")}
                                                    />
                                                    Traditional / Non-branded Jewellery
                                                </label>
                                                <FilterDescriptionFunction id={69} />
                                            </li>
                                        </div>
                                    </div>
                                </div>

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
                                            <li className="product_filters">
                                                <label className='product_filters_label'>
                                                    <input
                                                        className="form-check-input rest me-1"
                                                        type="checkbox"
                                                        value="moderately_priced"
                                                        onChange={handleJewelleryGoldChange}
                                                        checked={formdata.jewellery_gold && formdata.jewellery_gold.includes("moderately_priced")}
                                                    />
                                                    Moderately priced Gold Jewellery
                                                </label>
                                                <FilterDescriptionFunction id={70} />
                                            </li>
                                            <li className="product_filters">
                                                <label className='product_filters_label'>
                                                    <input
                                                        className="form-check-input rest me-1"
                                                        type="checkbox"
                                                        value="high_priced"
                                                        onChange={handleJewelleryGoldChange}
                                                        checked={formdata.jewellery_gold && formdata.jewellery_gold.includes("high_priced")}
                                                    />
                                                    High priced Gold Jewellery
                                                </label>
                                                <FilterDescriptionFunction id={71} />
                                            </li>
                                        </div>
                                    </div>
                                </div>

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
                                            <li className="product_filters">
                                                <label className='product_filters_label'>
                                                    <input
                                                        className="form-check-input rest me-1"
                                                        type="checkbox"
                                                        value="moderately_priced"
                                                        onChange={handleJewelleryDiamondChange}
                                                        checked={formdata.jewellery_diamond && formdata.jewellery_diamond.includes("moderately_priced")}
                                                    />
                                                    Moderately priced Diamond Jewellery
                                                </label>
                                                <FilterDescriptionFunction id={72} />
                                            </li>
                                            <li className="product_filters">
                                                <label className='product_filters_label'>
                                                    <input
                                                        className="form-check-input rest me-1"
                                                        type="checkbox"
                                                        value="high_priced"
                                                        onChange={handleJewelleryDiamondChange}
                                                        checked={formdata.jewellery_diamond && formdata.jewellery_diamond.includes("high_priced")}
                                                    />
                                                    High priced Diamond Jewellery
                                                </label>
                                                <FilterDescriptionFunction id={73} />
                                            </li>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
            </div>


            <div className="disable_container" style={{ display: commandStatus === "Ready" ? 'none' : 'block' }}></div>

            <div className="command_panel">

                <div className="accordion preset_container_main">
                    <div className="accordion-item">
                        <h2 className="accordion-header" id="headingOne">
                            <button className="accordion-button preset_container_header" type="button" data-bs-toggle="collapse" data-bs-target="#preset_name" aria-expanded="true" aria-controls="preset_name">
                                Your Audiences
                            </button>
                        </h2>
                        <div id="preset_name" className="accordion-collapse collapse show preset_container" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                            <div className="accordion-body">
                                {presetsData.map((item, index) => (
                                    <div key={index} className="preset_data">
                                        <div className="preset_info">
                                            <label>
                                                <input
                                                    type="radio"
                                                    name="presetSelection"
                                                    onChange={() => handlePresetSelection(item)}
                                                />
                                                {item.preset_name}
                                            </label>
                                        </div>
                                        <div className="delete_btn">
                                            <button
                                                data-bs-toggle="modal"
                                                data-bs-target="#deletePresetSolo"
                                                onClick={() => setDeletePresetName(item.preset_name)}
                                            >
                                                <MdDelete />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="command_btn_container">






                    {/* <button className="command_btn reach_btn" onClick={handleReachEstimate}> Reach Estimate </button> */}
                    <button className="command_btn reach_btn" onClick={handleKentrixSolo}>Market Audience</button>
                    <button className="command_btn" onClick={handleTimeEstimate}> Time Estimate</button>
                    <button className="command_btn reach_btn" type="button" data-bs-toggle="modal" data-bs-target="#createCompaign"> Create Campaign </button>
                    {/* <button className="command_btn" type="button" data-bs-toggle="modal" data-bs-target="#savePreset"> Save Audience </button> */}
                    <button className="command_btn" type="button" data-bs-toggle="modal" data-bs-target="#savePresetSolo"> Save Audience </button>

                    <button className="command_btn" onClick={handleReset}> Reset </button>


                    {/* <div className="alert alert-info">
                        <span id="status_text">
                            {isLoading ? 'Loading...' : 'Ready'}
                        </span>
                    </div> */}

                    <div className="alert alert-info">
                        {typeof commandStatus === 'string' && commandStatus.includes('\n') ? (
                            commandStatus.split('\n').map((line, index) => (
                                <React.Fragment key={index}>
                                    {line}
                                    <br />
                                </React.Fragment>
                            ))
                        ) : (
                            commandStatus
                        )}
                    </div>


                    <div className="result_section">
                        <div className='result_item'>
                            <label>Market Audience Size</label><br />

                            { reachedEstimationSolo.audience_count ? (
                                <>
                                    {formatIndianNumber(reachedEstimationSolo.audience_count)}
                                </>
                            ) : (
                                <span></span>
                            )}
                        </div>
                        <div className='result_item'>
                            <label>Time Estimation: </label>
                            {time_estimate_data.time}
                        </div>



                    </div>



                </div >

                <div className="modal fade" id="filterDescription" tabIndex="-1" aria-labelledby="filterDescriptionLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <PopupContent selectedId={selectedId} />
                    </div>
                </div>



                <div className="modal fade" id="savePresetSolo" tabIndex="-1" aria-labelledby="savePresetLabelSolo" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="savePresetLabelSolo">Save Audience</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className="popup_item">
                                    <label className="popup_heading">Audience Name</label>
                                    <input

                                        type="text"
                                        className="form-control campaign_text"
                                        placeholder="Enter Audience Name"
                                        aria-label="Username"
                                        aria-describedby="basic-addon1"
                                        value={presetName}
                                        onChange={e => setPresetName(e.target.value)}
                                    />


                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" onClick={handleSavePreset} className="btn_popup">Save</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="createCompaign" tabIndex="-1" aria-labelledby="createCompaignLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="createCampaignLabel">Create Campaign</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className="popup_item mb-5">
                                    <label className="popup_heading">Campaign Name</label><br />
                                    <input
                                        id="campaign_name"
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter Campaign Name"
                                        aria-label="Campaign Name"
                                        aria-describedby="basic-addon1"
                                        value={campaign_name}
                                        onChange={(e) => setCampaign_name(e.target.value)}
                                    />
                                </div>
                                <div className="popup_item mb-5">
                                    <label className="popup_heading">Campaign Objective</label><br />
                                    <select
                                        className="form-select"
                                        aria-label="Default select example"
                                        value={campaign_objective}
                                        onChange={(e) => setCampaign_objective(e.target.value)}
                                    >
                                        <option value="">Select Objective</option>
                                        <option value="OUTCOME_AWARENESS">AWARENESS</option>
                                        <option value="OUTCOME_TRAFFIC">TRAFFIC</option>
                                        <option value="OUTCOME_ENGAGEMENT">ENGAGEMENT</option>
                                        <option value="OUTCOME_LEADS">LEADS</option>
                                        <option value="OUTCOME_SALES">SALES</option>
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn_popup" onClick={handleCreateCampaign}>Create Campaign</button>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="modal fade" id="deletePresetSolo" tabIndex="-1" aria-labelledby="deletePresetLabelSolo" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="deletePresetLabelSolo">Delete Audience</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className="popup_item">
                                    <p>Are you sure you want to delete the audience "{deletePresetName}"?</p>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn_general" data-bs-dismiss="modal" aria-label="Close">Cancel</button>
                                <button type="button"
                                    onClick={() => handleDeletePreset(deletePresetName)}
                                    className="btn_general">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>



            </div >

        </>
    )
}

export default KentrixFiltersPage