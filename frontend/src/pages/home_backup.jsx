import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import KentrixFiltersPage from "./KentrixFiltersPage";
import axios from "axios";

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

export default function Home({ setLoginUser, setIsAuthenticated }) {
  // Preset states
  const [presets, setPresets] = useState([]);
  const [selectedPreset, setSelectedPreset] = useState("");
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [presetName, setPresetName] = useState("");
  const [loading, setLoading] = useState(false);

  // Filter states
  const [inclusionSegments, setInclusionSegments] = useState([
    "High Income Urban",
    "Tech Savvy Millennials",
    "Premium Auto Buyers",
  ]);
  const [exclusionSegments, setExclusionSegments] = useState([
    "Budget Conscious Rural",
    "Traditional Shoppers",
  ]);

  // All filter states
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

  // Get user ID (you'll need to implement this based on your auth system)
  const getUserId = () => {
    // Replace this with your actual user ID retrieval logic
    return localStorage.getItem('userId') || 'default_user';
  };

  // Create JSON format from current filter states
  const createPresetJSON = () => {
    return {
      audienceFilters: {
        income,
        regio_type,
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

  // Apply preset JSON to filter states
  const applyPresetJSON = (presetData) => {
    const { audienceFilters, segments } = presetData;
    
    // Apply audience filters
    setIncome(audienceFilters.income || []);
    setRegionType(audienceFilters.regio_type || []);
    setLifestyle(audienceFilters.lifestyle || []);
    setSecReference(audienceFilters.sec_reference || []);
    setSmallerTowns(audienceFilters.smaller_towns || []);
    setHealthCare(audienceFilters.health_care || []);
    setInsurance(audienceFilters.insurance || []);
    setBankingProduct(audienceFilters.banking_product || []);
    setCreditCard(audienceFilters.credit_card || []);
    setAutomobile(audienceFilters.automobile || []);
    setRealEstate(audienceFilters.real_estate || []);
    setLaundry(audienceFilters.laundry || []);
    setPersonalWash(audienceFilters.personal_wash || []);
    setPackagedFood(audienceFilters.packaged_food || []);
    setCosmetics(audienceFilters.cosmetics || []);
    setFashion(audienceFilters.fashion || []);
    setJewelleryTotal(audienceFilters.jewellery_total || []);
    setJewelleryGold(audienceFilters.jewellery_gold || []);
    setJewelleryDiamond(audienceFilters.jewellery_diamond || []);
    setTravelSpend(audienceFilters.travel_spend || []);
    setTravelDestination(audienceFilters.travel_destination || []);
    setOnlineRetail(audienceFilters.online_retail || []);
    setRetail(audienceFilters.retail || []);
    setTwoWheeler(audienceFilters.two_wheeler || []);
    setLaundry_washing_machine(audienceFilters.laundry_washing_machine || []);
    setTravel_destination_special(audienceFilters.travel_destination_special || []);

    // Apply segments
    setInclusionSegments(segments.inclusionSegments || []);
    setExclusionSegments(segments.exclusionSegments || []);
  };

  // Load preset list when component mounts
  useEffect(() => {
    loadPresetList();
  }, []);

  // API call to get preset list
  const loadPresetList = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/get_preset_list', {
        params: {
          user_id: getUserId(),
        },
      });
      
      if (response.data.success) {
        setPresets(response.data.presets || []);
      } else {
        console.error('Failed to load presets:', response.data.message);
      }
    } catch (error) {
      console.error('Error loading preset list:', error);
    } finally {
      setLoading(false);
    }
  };

  // API call to save preset
  const savePreset = async () => {
    if (!presetName.trim()) return;

    try {
      setLoading(true);
      const presetData = createPresetJSON();
      
      const response = await axios.post('http://localhost:5000/api/save_preset', {
        user_id: getUserId(),
        preset_name: presetName.trim(),
        preset_data: presetData,
      });

      if (response.data.success) {
        // Refresh preset list
        await loadPresetList();
        
        setPresetName("");
        setShowSaveDialog(false);
        
        // Show success message
        alert('Preset saved successfully!');
      } else {
        alert('Failed to save preset: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error saving preset:', error);
      alert('Error saving preset. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // API call to load specific preset
  const loadPreset = async (presetId) => {
    if (!presetId) return;

    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/get_preset', {
        params: {
          preset_id: presetId,
          user_id: getUserId(),
        },
      });

      if (response.data.success && response.data.preset_data) {
        applyPresetJSON(response.data.preset_data);
        setSelectedPreset(presetId);
        
        // Show success message
        alert('Preset loaded successfully!');
      } else {
        console.error('Failed to load preset:', response.data.message);
        alert('Failed to load preset: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error loading preset:', error);
      alert('Error loading preset. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // API call to delete preset
  const deletePreset = async (presetId) => {
    if (!presetId) return;

    try {
      setLoading(true);
      const response = await axios.delete('http://localhost:5000/api/delete_preset', {
        data: {
          preset_id: presetId,
          user_id: getUserId(),
        },
      });

      if (response.data.success) {
        // Refresh preset list
        await loadPresetList();
        
        // Clear selected preset if it was deleted
        if (selectedPreset === presetId) {
          setSelectedPreset("");
        }
        
        alert('Preset deleted successfully!');
      } else {
        alert('Failed to delete preset: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error deleting preset:', error);
      alert('Error deleting preset. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    setIncome([]);
    setRegionType([]);
    setLifestyle([]);
    setSecReference([]);
    setSmallerTowns([]);
    setHealthCare([]);
    setInsurance([]);
    setBankingProduct([]);
    setCreditCard([]);
    setAutomobile([]);
    setRealEstate([]);
    setLaundry([]);
    setPersonalWash([]);
    setPackagedFood([]);
    setCosmetics([]);
    setFashion([]);
    setJewelleryTotal([]);
    setJewelleryGold([]);
    setJewelleryDiamond([]);
    setTravelSpend([]);
    setTravelDestination([]);
    setOnlineRetail([]);
    setRetail([]);
    setTwoWheeler([]);
    setLaundry_washing_machine([]);
    setTravel_destination_special([]);
    setInclusionSegments([]);
    setExclusionSegments([]);
    setSelectedPreset("");
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

  // All your existing handle functions...
  const handleIncomeChange = (event) => {
    handleMultipleSelection(event, setIncome);
  };

  const handleRegionTypeChange = (event) => {
    handleMultipleSelection(event, setRegionType);
  };

  const handleLifestyleChange = (event) => {
    handleMultipleSelection(event, setLifestyle);
  };

  const handleSecReferenceChange = (event) => {
    handleMultipleSelection(event, setSecReference);
  };

  const handleSmallerTownsChange = (event) => {
    handleMultipleSelection(event, setSmallerTowns);
  };

  const handleHealthCareChange = (event) => {
    handleMultipleSelection(event, setHealthCare);
  };

  const handleInsuranceChange = (event) => {
    handleMultipleSelection(event, setInsurance);
  };

  const handleBankingProductChange = (event) => {
    handleMultipleSelection(event, setBankingProduct);
  };

  const handleCreditCardChange = (event) => {
    handleMultipleSelection(event, setCreditCard);
  };

  const handleAutomobileChange = (event) => {
    handleMultipleSelection(event, setAutomobile);
  };

  const handleRealEstateChange = (event) => {
    handleMultipleSelection(event, setRealEstate);
  };

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

  const handlePersonalWashChange = (event) => {
    handleMultipleSelection(event, setPersonalWash);
  };

  const handlePackagedFoodChange = (event) => {
    handleMultipleSelection(event, setPackagedFood);
  };

  const handleCosmeticsChange = (event) => {
    handleMultipleSelection(event, setCosmetics);
  };

  const handleFashionChange = (event) => {
    handleMultipleSelection(event, setFashion);
  };

  const handleJewelleryTotalChange = (event) => {
    handleMultipleSelection(event, setJewelleryTotal);
  };

  const handleJewelleryGoldChange = (event) => {
    handleMultipleSelection(event, setJewelleryGold);
  };

  const handleJewelleryDiamondChange = (event) => {
    handleMultipleSelection(event, setJewelleryDiamond);
  };

  const handleTravelSpendChange = (event) => {
    handleMultipleSelection(event, setTravelSpend);
  };

  const handleOnlineRetailChange = (event) => {
    handleMultipleSelection(event, setOnlineRetail);
  };

  const handleRetailChange = (event) => {
    handleMultipleSelection(event, setRetail);
  };

  const handleTwoWheelerChange = (event) => {
    handleMultipleSelection(event, setTwoWheeler);
  };

  const handleApplyFilter = async () => {
    try {
      const res = await axios.post("http://localhost:5000/get_segments", {
        formdata,
      });
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };

  const formdata = {
    income: income,
    regio_type: regio_type,
    lifestyle: lifestyle,
    sec_reference: sec_reference,
    smaller_towns: smaller_towns,
    health_care: health_care,
    insurance: insurance,
    banking_product: banking_product,
    credit_card: credit_card,
    automobile: automobile,
    real_estate: real_estate,
    laundry: laundry,
    personal_wash: personal_wash,
    packaged_food: packaged_food,
    cosmetics: cosmetics,
    fashion: fashion,
    jewellery_total: jewellery_total,
    jewellery_gold: jewellery_gold,
    jewellery_diamond: jewellery_diamond,
    travel_spend: travel_spend,
    travel_destination: travel_destination,
    online_retail: online_retail,
    retail: retail,
    two_wheeler: two_wheeler,
    laundry_washing_machine: laundry_washing_machine,
    travel_destination_special: travel_destination_special,
  };

  return (
    <div>
      <Navbar
        setLoginUser={setLoginUser}
        setIsAuthenticated={setIsAuthenticated}
      />
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
        {/* Filters Section - 50% */}
        <div style={{ flex: "3" }}>
          <h2
            style={{
              marginBottom: "1.5rem",
              fontSize: "1.25rem",
              fontWeight: "600",
              color: "#111827",
            }}
          >
            Audience Filters
          </h2>
          <KentrixFiltersPage
            handleIncomeChange={handleIncomeChange}
            handleRegionTypeChange={handleRegionTypeChange}
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
            formdata={formdata}
          />
        </div>

        {/* Output Section - 50% */}
        <div style={{ flex: "2" }}>
          <h2
            style={{
              marginBottom: "1.5rem",
              fontSize: "1.25rem",
              fontWeight: "600",
              color: "#111827",
            }}
          >
            Selected Segments
          </h2>

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
                {/* Preset Dropdown */}
                <select
                  value={selectedPreset}
                  onChange={(e) => {
                    if (e.target.value) {
                      loadPreset(e.target.value);
                    } else {
                      setSelectedPreset("");
                    }
                  }}
                  disabled={loading}
                  style={{
                    padding: "0.5rem",
                    borderRadius: "4px",
                    border: "1px solid #d1d5db",
                    fontSize: "0.875rem",
                    width: "300px",
                    maxWidth: "300px",
                    minWidth: "300px",
                    cursor: loading ? "not-allowed" : "pointer",
                    backgroundColor: loading ? "#f9fafb" : "white",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  <option value="">
                    {loading ? "Loading presets..." : "Select a preset..."}
                  </option>
                  {presets.map((preset) => (
                    <option key={preset.id} value={preset.id}>
                      {preset.name}
                    </option>
                  ))}
                </select>

                {/* Save Preset Button */}
                <button
                  onClick={() => setShowSaveDialog(true)}
                  disabled={loading}
                  style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: loading ? "#9ca3af" : "#059669",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "0.875rem",
                    cursor: loading ? "not-allowed" : "pointer",
                    fontWeight: "500",
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) e.target.style.backgroundColor = "#047857";
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) e.target.style.backgroundColor = "#059669";
                  }}
                >
                  {loading ? "Loading..." : "Save Preset"}
                </button>

                {/* Delete Preset Button */}
                {selectedPreset && (
                  <button
                    onClick={() => {
                      const presetToDelete = presets.find(p => p.id === selectedPreset);
                      if (window.confirm(`Delete preset "${presetToDelete?.name}"?`)) {
                        deletePreset(selectedPreset);
                      }
                    }}
                    disabled={loading}
                    style={{
                      padding: "0.5rem 1rem",
                      backgroundColor: loading ? "#9ca3af" : "#dc2626",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      fontSize: "0.875rem",
                      cursor: loading ? "not-allowed" : "pointer",
                      fontWeight: "500",
                    }}
                    onMouseEnter={(e) => {
                      if (!loading) e.target.style.backgroundColor = "#b91c1c";
                    }}
                    onMouseLeave={(e) => {
                      if (!loading) e.target.style.backgroundColor = "#dc2626";
                    }}
                  >
                    Delete
                  </button>
                )}

                {/* Clear All Filters Button */}
                <button
                  onClick={() => {
                    if (window.confirm("Clear all filters?")) {
                      clearAllFilters();
                    }
                  }}
                  disabled={loading}
                  style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: loading ? "#9ca3af" : "#f59e0b",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "0.875rem",
                    cursor: loading ? "not-allowed" : "pointer",
                    fontWeight: "500",
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) e.target.style.backgroundColor = "#d97706";
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) e.target.style.backgroundColor = "#f59e0b";
                  }}
                >
                  Clear All
                </button>
              </div>

              {/* Preset Count */}
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "#6b7280",
                  margin: 0,
                }}
              >
                {presets.length} saved preset{presets.length !== 1 ? "s" : ""}
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
                    disabled={loading}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "1px solid #d1d5db",
                      borderRadius: "4px",
                      fontSize: "0.875rem",
                      marginBottom: "1.5rem",
                      boxSizing: "border-box",
                      backgroundColor: loading ? "#f9fafb" : "white",
                      cursor: loading ? "not-allowed" : "text",
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !loading) {
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
                      disabled={loading}
                      style={{
                        padding: "0.5rem 1rem",
                        border: "1px solid #d1d5db",
                        borderRadius: "4px",
                        backgroundColor: "white",
                        cursor: loading ? "not-allowed" : "pointer",
                        fontSize: "0.875rem",
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={savePreset}
                      disabled={!presetName.trim() || loading}
                      style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: presetName.trim() && !loading ? "#059669" : "#9ca3af",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: presetName.trim() && !loading ? "pointer" : "not-allowed",
                        fontSize: "0.875rem",
                        fontWeight: "500",
                      }}
                    >
                      {loading ? "Saving..." : "Save"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Inclusion Section */}
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

            {/* Exclusion Section */}
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

            {/* Submit Button */}
            <button
              onClick={handleApplyFilter}
              disabled={loading}
              style={{
                width: "100%",
                padding: "0.75rem 1.5rem",
                backgroundColor: loading ? "#9ca3af" : "#6366f1",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontSize: "1rem",
                fontWeight: "500",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => {
                if (!loading) e.target.style.backgroundColor = "#4f46e5";
              }}
              onMouseLeave={(e) => {
                if (!loading) e.target.style.backgroundColor = "#6366f1";
              }}
            >
              {loading ? "Processing..." : "Apply Filters"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}