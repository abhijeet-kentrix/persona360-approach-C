import { useState, useEffect, useCallback } from "react";
import Navbar from "../components/Navbar";
import KentrixFiltersPage from "./KentrixFiltersPage";
import {
  createPreset,
  getPresetsList,
  getPresetById,
  updatePreset,
  deletePreset,
  buildAudience
} from "../apiClient";

const SegmentCard = ({ segments, onRemove }) => (
  <div style={{ marginBottom: "1rem" }}>
    {segments.map((segment, index) => (
      <div
        key={index}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0.5rem 0.75rem",
          backgroundColor: "#f3f4f6",
          border: "1px solid #d1d5db",
          borderRadius: "6px",
          marginBottom: "0.5rem",
          fontSize: "0.875rem",
        }}
      >
        <span>{segment}</span>
        <button
          onClick={() => onRemove(segment)}
          style={{
            background: "none",
            border: "none",
            color: "#9ca3af",
            cursor: "pointer",
            fontSize: "1rem",
            padding: "0",
            width: "16px",
            height: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ×
        </button>
      </div>
    ))}
  </div>
);

export default function Home({ setLoginUser, setIsAuthenticated, userDsp }) {
  const [presetsList, setPresetsList] = useState([]);
  const [selectedPreset, setSelectedPreset] = useState("");
  const [selectedPresetId, setSelectedPresetId] = useState(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [presetName, setPresetName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [audienceCount, setAudienceCount] = useState(null);

  const [inclusionSegments, setInclusionSegments] = useState([]);
  const [exclusionSegments, setExclusionSegments] = useState([]);

  // Filter states
  const [income, setIncome] = useState([]);
  const [regio_type, setRegionType] = useState([]);
  const [lifestyle, setLifestyle] = useState([]);
  const [sec_reference, setSecReference] = useState([]);
  const [smaller_towns, setSmallerTowns] = useState([]);
  const [health_care, setHealthCare] = useState([]);
  const [insurance, setInsurance] = useState([]);
  const [banking_product, setBankingProduct] = useState([]);
  const [credit_card, setCreditCard] = useState([]);
  const [automobile, setAutomobile] = useState([]);
  const [real_estate, setRealEstate] = useState([]);
  const [laundry, setLaundry] = useState([]);
  const [personal_wash, setPersonalWash] = useState([]);
  const [packaged_food, setPackagedFood] = useState([]);
  const [cosmetics, setCosmetics] = useState([]);
  const [fashion, setFashion] = useState([]);
  const [jewellery_total, setJewelleryTotal] = useState([]);
  const [jewellery_gold, setJewelleryGold] = useState([]);
  const [jewellery_diamond, setJewelleryDiamond] = useState([]);
  const [travel_spend, setTravelSpend] = useState([]);
  const [travel_destination, setTravelDestination] = useState([]);
  const [online_retail, setOnlineRetail] = useState([]);
  const [retail, setRetail] = useState([]);
  const [two_wheeler, setTwoWheeler] = useState([]);
  const [laundry_washing_machine, setLaundry_washing_machine] = useState([]);
  const [travel_destination_special, setTravel_destination_special] = useState([]);
  const [TV, setTV] = useState([]);
  const [Smartphone, setSmartphone] = useState([]);
  const [Refrigerator, setRefrigerator] = useState([]);
  const [WashingMachine, setWashingMachine] = useState([]);
  const [AirConditioner, setAirConditioner] = useState([]);
  const [city_name, setCityName] = useState([]);

  // Show message with auto-hide
  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  // Fetch lightweight preset list
  const fetchPresetsList = useCallback(async () => {
    try {
      const res = await getPresetsList();
      console.log("Fetch presets list response:", res);
      
      if (res.success && res.data.presets) {
        setPresetsList(res.data.presets);
        console.log("Loaded presets list:", res.data.presets);
      } else {
        console.error("Failed to fetch presets list:", res.error);
        showMessage("Failed to load presets", "error");
      }
    } catch (error) {
      console.error("Error fetching presets list:", error);
      showMessage("Failed to load presets", "error");
    }
  }, []);

  // Load presets on component mount
  useEffect(() => {
    fetchPresetsList();
  }, [fetchPresetsList]);

  // Create JSON format from current filter states
  const createPresetJSON = () => {
    return {
      audienceFilters: {
        income,
        regio_type,
        city_name,
        lifestyle,
        sec_reference,
        smaller_towns,
        health_care,
        insurance,
        banking_product,
        credit_card,
        automobile,
        real_estate,
        laundry,
        personal_wash,
        packaged_food,
        cosmetics,
        fashion,
        jewellery_total,
        jewellery_gold,
        jewellery_diamond,
        travel_spend,
        travel_destination,
        online_retail,
        retail,
        two_wheeler,
        laundry_washing_machine,
        travel_destination_special,
        TV,
        Smartphone,
        Refrigerator,
        WashingMachine,
        AirConditioner,
      },
      segments: {
        inclusionSegments,
        exclusionSegments,
      },
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };
  };

  // Apply filters from preset JSON
  const applyFiltersFromJSON = (filterJson) => {
    console.log("Applying filters from JSON:", filterJson);
    
    const filters = filterJson.audienceFilters || {};
    const segments = filterJson.segments || {};

    // Set all filter states
    setIncome(filters.income || []);
    setRegionType(filters.regio_type || []);
    setCityName(filters.city_name || []);
    setLifestyle(filters.lifestyle || []);
    setSecReference(filters.sec_reference || []);
    setSmallerTowns(filters.smaller_towns || []);
    setHealthCare(filters.health_care || []);
    setInsurance(filters.insurance || []);
    setBankingProduct(filters.banking_product || []);
    setCreditCard(filters.credit_card || []);
    setAutomobile(filters.automobile || []);
    setRealEstate(filters.real_estate || []);
    setLaundry(filters.laundry || []);
    setPersonalWash(filters.personal_wash || []);
    setPackagedFood(filters.packaged_food || []);
    setCosmetics(filters.cosmetics || []);
    setFashion(filters.fashion || []);
    setJewelleryTotal(filters.jewellery_total || []);
    setJewelleryGold(filters.jewellery_gold || []);
    setJewelleryDiamond(filters.jewellery_diamond || []);
    setTravelSpend(filters.travel_spend || []);
    setTravelDestination(filters.travel_destination || []);
    setOnlineRetail(filters.online_retail || []);
    setRetail(filters.retail || []);
    setTwoWheeler(filters.two_wheeler || []);
    setLaundry_washing_machine(filters.laundry_washing_machine || []);
    setTravel_destination_special(filters.travel_destination_special || []);
    setTV(filters.TV || []);
    setSmartphone(filters.Smartphone || []);
    setRefrigerator(filters.Refrigerator || []);
    setWashingMachine(filters.WashingMachine || []);
    setAirConditioner(filters.AirConditioner || []);

    // Set segments
    setInclusionSegments(segments.inclusionSegments || []);
    setExclusionSegments(segments.exclusionSegments || []);
    
    console.log("Filters applied successfully");
  };

  // Save preset
  const savePreset = async () => {
    if (!presetName.trim()) return;

    setIsLoading(true);
    const preset_filter_json = createPresetJSON();
    const payload = {
      preset_name: presetName,
      preset_filter_json: preset_filter_json,
    };

    try {
      const res = await createPreset(payload);

      if (res.success) {
        await fetchPresetsList();
        setPresetName("");
        setShowSaveDialog(false);
        showMessage("Preset saved successfully!", "success");
      } else {
        showMessage(res.error || "Failed to create preset", "error");
      }
    } catch (error) {
      console.error("Error creating preset:", error);
      showMessage("Error creating preset", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Load preset by ID
  const loadPreset = async (presetId, presetName) => {
    if (!presetId) {
      console.error("No preset ID provided");
      return;
    }

    setIsLoading(true);
    console.log("Loading preset ID:", presetId);

    try {
      const res = await getPresetById(presetId);
      console.log("Preset data received:", res);

      if (res.success && res.data.preset) {
        const presetData = res.data.preset;
        setSelectedPresetId(presetId);
        
        if (presetData.preset_filter_json) {
          applyFiltersFromJSON(presetData.preset_filter_json);
          showMessage(`Loaded preset: ${presetName}`, "success");
        } else {
          showMessage("Preset data is empty", "error");
        }
      } else {
        showMessage(res.error || "Failed to load preset", "error");
      }
    } catch (error) {
      console.error("Error loading preset:", error);
      showMessage("Error loading preset", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Update preset
  const handleUpdatePreset = async () => {
    if (!selectedPresetId) {
      showMessage("No preset selected to update", "error");
      return;
    }

    setIsLoading(true);
    const preset_filter_json = createPresetJSON();
    const payload = {
      preset_filter_json: preset_filter_json,
    };

    try {
      const res = await updatePreset(selectedPresetId, payload);

      if (res.success) {
        await fetchPresetsList();
        showMessage("Preset updated successfully!", "success");
      } else {
        showMessage(res.error || "Failed to update preset", "error");
      }
    } catch (error) {
      console.error("Error updating preset:", error);
      showMessage("Error updating preset", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete preset
  const handleDeletePreset = async (presetId, presetName) => {
    if (!presetId) return;

    if (window.confirm(`Delete preset "${presetName}"?`)) {
      setIsLoading(true);
      try {
        const res = await deletePreset(presetId);

        if (res.success) {
          await fetchPresetsList();
          if (selectedPresetId === presetId) {
            setSelectedPreset("");
            setSelectedPresetId(null);
          }
          showMessage("Preset deleted successfully!", "success");
        } else {
          showMessage(res.error || "Failed to delete preset", "error");
        }
      } catch (error) {
        console.error("Error deleting preset:", error);
        showMessage("Error deleting preset", "error");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Build Audience - Main function
  const handleBuildAudience = async () => {
    setIsLoading(true);
    const payload = createPresetJSON();

    try {
      const res = await buildAudience(payload);

      if (res.success) {
        // Backend returns different data based on DSP flag
        if (userDsp) {
          // DSP users only get audience count
          const { audienceCount } = res.data;
          setAudienceCount(audienceCount || 0);
          setInclusionSegments([]);
          setExclusionSegments([]);
        } else {
          // Non-DSP users only get segments
          const { inclusionSegments, exclusionSegments } = res.data;
          setInclusionSegments(inclusionSegments || []);
          setExclusionSegments(exclusionSegments || []);
          setAudienceCount(null);
        }
        showMessage("Audience built successfully!", "success");
      } else {
        showMessage(res.error || "Failed to build audience", "error");
      }
    } catch (error) {
      console.error("Error building audience:", error);
      showMessage("Error building audience", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromInclusion = (segment) => {
    setInclusionSegments((prev) => prev.filter((s) => s !== segment));
  };

  const removeFromExclusion = (segment) => {
    setExclusionSegments((prev) => prev.filter((s) => s !== segment));
  };

  const handleMultipleSelection = (event, setState) => {
    const { value, checked } = event.target;
    if (checked) {
      setState((prevValue) => [...prevValue, value]);
    } else {
      setState((prevValue) => prevValue.filter((option) => option !== value));
    }
  };

  const handleIncomeChange = (event) => handleMultipleSelection(event, setIncome);
  const handleRegionTypeChange = (event) => handleMultipleSelection(event, setRegionType);
  const handleCityNameChange = (event) => handleMultipleSelection(event, setCityName);
  const handleLifestyleChange = (event) => handleMultipleSelection(event, setLifestyle);
  const handleSecReferenceChange = (event) => handleMultipleSelection(event, setSecReference);
  const handleSmallerTownsChange = (event) => handleMultipleSelection(event, setSmallerTowns);
  const handleHealthCareChange = (event) => handleMultipleSelection(event, setHealthCare);
  const handleInsuranceChange = (event) => handleMultipleSelection(event, setInsurance);
  const handleBankingProductChange = (event) => handleMultipleSelection(event, setBankingProduct);
  const handleCreditCardChange = (event) => handleMultipleSelection(event, setCreditCard);
  const handleAutomobileChange = (event) => handleMultipleSelection(event, setAutomobile);
  const handleRealEstateChange = (event) => handleMultipleSelection(event, setRealEstate);
  const handlePersonalWashChange = (event) => handleMultipleSelection(event, setPersonalWash);
  const handlePackagedFoodChange = (event) => handleMultipleSelection(event, setPackagedFood);
  const handleCosmeticsChange = (event) => handleMultipleSelection(event, setCosmetics);
  const handleFashionChange = (event) => handleMultipleSelection(event, setFashion);
  const handleJewelleryTotalChange = (event) => handleMultipleSelection(event, setJewelleryTotal);
  const handleJewelleryGoldChange = (event) => handleMultipleSelection(event, setJewelleryGold);
  const handleJewelleryDiamondChange = (event) => handleMultipleSelection(event, setJewelleryDiamond);
  const handleTravelSpendChange = (event) => handleMultipleSelection(event, setTravelSpend);
  const handleOnlineRetailChange = (event) => handleMultipleSelection(event, setOnlineRetail);
  const handleRetailChange = (event) => handleMultipleSelection(event, setRetail);
  const handleTwoWheelerChange = (event) => handleMultipleSelection(event, setTwoWheeler);
  const handleTVChange = (event) => handleMultipleSelection(event, setTV);
  const handleSmartphoneChange = (event) => handleMultipleSelection(event, setSmartphone);
  const handleRefrigeratorChange = (event) => handleMultipleSelection(event, setRefrigerator);
  const handleWashingMachineChange = (event) => handleMultipleSelection(event, setWashingMachine);
  const handleAirConditionerChange = (event) => handleMultipleSelection(event, setAirConditioner);

  const handleLaundryChange = (event) => {
    handleMultipleSelection(event, setLaundry);
    handleLaundryWashingMachineChange(event);
  };

  const handleLaundryWashingMachineChange = (event) => {
    const { value, checked } = event.target;
    if (value === "laundry_washing_machine") {
      if (checked) {
        setLaundry_washing_machine(["laundry_washing_machine"]);
      } else {
        setLaundry_washing_machine([]);
      }
    }
  };

  const handleTravelDestinationChange = (event) => {
    handleMultipleSelection(event, setTravelDestination);
    handleTravelDestinationSpecialChange(event);
  };

  const handleTravelDestinationSpecialChange = (event) => {
    const { value, checked } = event.target;
    if (value === "travel_destination_special") {
      if (checked) {
        setTravel_destination_special(["travel_destination_special"]);
      } else {
        setTravel_destination_special([]);
      }
    }
  };

  const formdata = {
    income,
    regio_type,
    city_name,
    lifestyle,
    sec_reference,
    smaller_towns,
    health_care,
    insurance,
    banking_product,
    credit_card,
    automobile,
    real_estate,
    laundry,
    personal_wash,
    packaged_food,
    cosmetics,
    fashion,
    jewellery_total,
    jewellery_gold,
    jewellery_diamond,
    travel_spend,
    travel_destination,
    online_retail,
    retail,
    two_wheeler,
    laundry_washing_machine,
    travel_destination_special,
    TV,
    Smartphone,
    Refrigerator,
    WashingMachine,
    AirConditioner,
  };

  return (
    <div>
      <Navbar
        setLoginUser={setLoginUser}
        setIsAuthenticated={setIsAuthenticated}
      />

      {/* Message Alert */}
      {message.text && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            padding: "1rem 1.5rem",
            backgroundColor: message.type === "success" ? "#10b981" : "#ef4444",
            color: "white",
            borderRadius: "6px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            zIndex: 1000,
            animation: "slideIn 0.3s ease-out",
          }}
        >
          {message.text}
        </div>
      )}

      <div
        style={{
          display: "flex",
          maxWidth: "80%",
          margin: "0 auto",
          gap: "2rem",
          padding: "2rem",
          minHeight: "calc(100vh - 80px)",
        }}
      >
        {/* Filters Section */}
        <div style={{ flex: "3" }}>
          <h2
            style={{
              marginBottom: "1.5rem",
              fontSize: "1.25rem",
              fontWeight: "600",
              color: "#111827",
            }}
          >
            Choose Segments For Your Audience
          </h2>
          <KentrixFiltersPage
            handleIncomeChange={handleIncomeChange}
            handleRegionTypeChange={handleRegionTypeChange}
            handleCityNameChange={handleCityNameChange}
            handleLifestyleChange={handleLifestyleChange}
            handleSecReferenceChange={handleSecReferenceChange}
            handleSmallerTownsChange={handleSmallerTownsChange}
            handleHealthCareChange={handleHealthCareChange}
            handleInsuranceChange={handleInsuranceChange}
            handleBankingProductChange={handleBankingProductChange}
            handleCreditCardChange={handleCreditCardChange}
            handleAutomobileChange={handleAutomobileChange}
            handleRealEstateChange={handleRealEstateChange}
            handleLaundryChange={handleLaundryChange}
            handlePersonalWashChange={handlePersonalWashChange}
            handlePackagedFoodChange={handlePackagedFoodChange}
            handleCosmeticsChange={handleCosmeticsChange}
            handleFashionChange={handleFashionChange}
            handleJewelleryTotalChange={handleJewelleryTotalChange}
            handleJewelleryGoldChange={handleJewelleryGoldChange}
            handleJewelleryDiamondChange={handleJewelleryDiamondChange}
            handleTravelSpendChange={handleTravelSpendChange}
            handleTravelDestinationChange={handleTravelDestinationChange}
            handleOnlineRetailChange={handleOnlineRetailChange}
            handleRetailChange={handleRetailChange}
            handleTwoWheelerChange={handleTwoWheelerChange}
            handleTVChange={handleTVChange}
            handleSmartphoneChange={handleSmartphoneChange}
            handleRefrigeratorChange={handleRefrigeratorChange}
            handleWashingMachineChange={handleWashingMachineChange}
            handleAirConditionerChange={handleAirConditionerChange}
            formdata={formdata}
          />
        </div>

        {/* Output Section */}
        <div style={{ flex: "2" }}>
          <div
            style={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "1.5rem",
            }}
          >
            {/* Preset Controls */}
            <div style={{ marginBottom: "2rem" }}>
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: "600",
                  color: "#111827",
                  marginBottom: "1rem",
                }}
              >
                Filter Presets
              </h3>

              <div
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  alignItems: "center",
                  marginBottom: "1rem",
                  flexWrap: "wrap",
                }}
              >
                <select
                  value={selectedPreset}
                  onChange={(e) => {
                    const presetName = e.target.value;
                    setSelectedPreset(presetName);
                    if (presetName) {
                      const preset = presetsList.find(p => p.preset_name === presetName);
                      if (preset) {
                        loadPreset(preset.preset_id, preset.preset_name);
                      }
                    } else {
                      setSelectedPresetId(null);
                    }
                  }}
                  disabled={isLoading}
                  style={{
                    padding: "0.5rem",
                    borderRadius: "4px",
                    border: "1px solid #d1d5db",
                    fontSize: "0.875rem",
                    width: "300px",
                    cursor: "pointer",
                  }}
                >
                  <option value="">Select a preset...</option>
                  {presetsList.map((preset) => (
                    <option key={preset.preset_id} value={preset.preset_name}>
                      {preset.preset_name}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => setShowSaveDialog(true)}
                  disabled={isLoading}
                  style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: "#059669",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "0.875rem",
                    cursor: isLoading ? "not-allowed" : "pointer",
                    fontWeight: "500",
                    opacity: isLoading ? 0.6 : 1,
                  }}
                >
                  Save New
                </button>

                {selectedPreset && (
                  <>
                    <button
                      onClick={handleUpdatePreset}
                      disabled={isLoading}
                      style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: "#3b82f6",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        fontSize: "0.875rem",
                        cursor: isLoading ? "not-allowed" : "pointer",
                        fontWeight: "500",
                        opacity: isLoading ? 0.6 : 1,
                      }}
                    >
                      Update
                    </button>
                    <button
                      onClick={() => {
                        const preset = presetsList.find(p => p.preset_name === selectedPreset);
                        if (preset) {
                          handleDeletePreset(preset.preset_id, preset.preset_name);
                        }
                      }}
                      disabled={isLoading}
                      style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: "#dc2626",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        fontSize: "0.875rem",
                        cursor: isLoading ? "not-allowed" : "pointer",
                        fontWeight: "500",
                        opacity: isLoading ? 0.6 : 1,
                      }}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>

              <p style={{ fontSize: "0.75rem", color: "#6b7280", margin: 0 }}>
                {presetsList.length} saved preset
                {presetsList.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Save Preset Dialog */}
            {showSaveDialog && (
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1000,
                }}
              >
                <div
                  style={{
                    backgroundColor: "white",
                    padding: "2rem",
                    borderRadius: "8px",
                    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
                    minWidth: "300px",
                  }}
                >
                  <h3
                    style={{
                      margin: "0 0 1rem 0",
                      fontSize: "1.125rem",
                      fontWeight: "600",
                    }}
                  >
                    Save Filter Preset
                  </h3>

                  <input
                    type="text"
                    value={presetName}
                    onChange={(e) => setPresetName(e.target.value)}
                    placeholder="Enter preset name..."
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "1px solid #d1d5db",
                      borderRadius: "4px",
                      fontSize: "0.875rem",
                      marginBottom: "1.5rem",
                      boxSizing: "border-box",
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        savePreset();
                      } else if (e.key === "Escape") {
                        setShowSaveDialog(false);
                        setPresetName("");
                      }
                    }}
                    autoFocus
                  />

                  <div
                    style={{
                      display: "flex",
                      gap: "0.75rem",
                      justifyContent: "flex-end",
                    }}
                  >
                    <button
                      onClick={() => {
                        setShowSaveDialog(false);
                        setPresetName("");
                      }}
                      style={{
                        padding: "0.5rem 1rem",
                        border: "1px solid #d1d5db",
                        borderRadius: "4px",
                        backgroundColor: "white",
                        cursor: "pointer",
                        fontSize: "0.875rem",
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={savePreset}
                      disabled={!presetName.trim() || isLoading}
                      style={{
                        padding: "0.5rem 1rem",
                        backgroundColor:
                          presetName.trim() && !isLoading
                            ? "#059669"
                            : "#9ca3af",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor:
                          presetName.trim() && !isLoading
                            ? "pointer"
                            : "not-allowed",
                        fontSize: "0.875rem",
                        fontWeight: "500",
                      }}
                    >
                      {isLoading ? "Saving..." : "Save"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Inclusion Section - Only show when DSP is FALSE */}
            {!userDsp && (
              <div style={{ marginBottom: "2rem" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      backgroundColor: "#10b981",
                      marginRight: "0.5rem",
                    }}
                  ></div>
                  <h3
                    style={{
                      fontSize: "1rem",
                      fontWeight: "600",
                      color: "#111827",
                      margin: 0,
                    }}
                  >
                    Inclusion ({inclusionSegments.length})
                  </h3>
                </div>
                {inclusionSegments.length > 0 ? (
                  <SegmentCard
                    segments={inclusionSegments}
                    onRemove={removeFromInclusion}
                  />
                ) : (
                  <p
                    style={{
                      color: "#9ca3af",
                      fontSize: "0.875rem",
                      fontStyle: "italic",
                      margin: "0 0 1rem 0",
                    }}
                  >
                    No inclusion segments selected
                  </p>
                )}
              </div>
            )}

            {/* Exclusion Section - Only show when DSP is FALSE */}
            {!userDsp && (
              <div style={{ marginBottom: "2rem" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      backgroundColor: "#ef4444",
                      marginRight: "0.5rem",
                    }}
                  ></div>
                  <h3
                    style={{
                      fontSize: "1rem",
                      fontWeight: "600",
                      color: "#111827",
                      margin: 0,
                    }}
                  >
                    Exclusion ({exclusionSegments.length})
                  </h3>
                </div>
                {exclusionSegments.length > 0 ? (
                  <SegmentCard
                    segments={exclusionSegments}
                    onRemove={removeFromExclusion}
                  />
                ) : (
                  <p
                    style={{
                      color: "#9ca3af",
                      fontSize: "0.875rem",
                      fontStyle: "italic",
                      margin: "0 0 1rem 0",
                    }}
                  >
                    No exclusion segments selected
                  </p>
                )}
              </div>
            )}

            {/* Build Audience Button */}
            <button
              onClick={handleBuildAudience}
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "0.75rem 1.5rem",
                backgroundColor: isLoading ? "#9ca3af" : "#6366f1",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontSize: "1rem",
                fontWeight: "500",
                cursor: isLoading ? "not-allowed" : "pointer",
                transition: "background-color 0.2s",
              }}
            >
              {isLoading ? "Building..." : "Build Your Audience"}
            </button>

            {/* Audience Count Display - Only show when DSP is TRUE */}
            {userDsp && audienceCount !== null && (
              <div
                style={{
                  marginTop: "1.5rem",
                  padding: "1.5rem",
                  backgroundColor: "#f0f9ff",
                  border: "2px solid #3b82f6",
                  borderRadius: "8px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "0.75rem",
                  }}
                >
                  <div
                    style={{
                      fontSize: "1.5rem",
                      marginRight: "0.5rem",
                    }}
                  >
                    👥
                  </div>
                  <h4
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      color: "#1e40af",
                      margin: 0,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Total Audience Size
                  </h4>
                </div>

                <div
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: "700",
                    color: "#1e3a8a",
                    marginBottom: "0.25rem",
                    fontFamily: "monospace",
                  }}
                >
                  {new Intl.NumberFormat('en-IN').format(audienceCount)}
                </div>

                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "#64748b",
                    margin: 0,
                  }}
                >
                  Unique users matching your criteria
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}