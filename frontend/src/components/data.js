export const ESI_Segments = {
    "01: Low INR <20,000":[30,13.4],
    "02: Medium Low INR 20,000 - 40,000":[8,13.4],
    "03: Medium INR 40,000 - 80,000":[6,13.4],
    "04: Medium Good INR 80,000 - 1,30,000":[30,13.4],
    "05: Good INR 1,30,000 - 1,70,000" :[10,16.4],
    "06: Very Good INR 1,70,000 - 2,30,000":[30,4.4],
    "07: High INR 2,30,000 - 3,00,000":[70,3.4],
    "08: Very High INR > 3,00,000":[3,1.4] 
};

export const LSI_Segments = [
    "01: Urban Established Elite",
    "02: Urban New Wealth",
    "03: Aspiring Urban Middle Class",
    "04: Conservative Urban Middle Class",
    "05: Successful Urban Fast Climbers",
    "06: Upcoming Urban Climbers",
    "07: Striving Urban Climbers",
    "08: Urban Dependants",
    "09: Daily Urban Survivors"
];

// export const CrossTable_Segments = {
//     "01: Urban Established Elite":{"a":1,"b":2,"c":3,"d":4,"e":5,"f":6,"g":7,"h":8,"i":9,"j":10,"l":11},
//     "02: Urban New Wealth":{"a":1,"b":2,"c":3,"d":4,"e":5,"f":6,"g":7,"h":8,"i":9,"j":10,"l":11},
//     "03: Aspiring Urban Middle Class":{"a":1,"b":2,"c":3,"d":4,"e":5,"f":6,"g":7,"h":8,"i":9,"j":10,"l":11},
//     "04: Conservative Urban Middle Class":{"a":1,"b":2,"c":3,"d":4,"e":5,"f":6,"g":7,"h":8,"i":9,"j":10,"l":11},
//     "05: Successful Urban Fast Climbers":{"a":1,"b":2,"c":3,"d":4,"e":5,"f":6,"g":7,"h":8,"i":9,"j":10,"l":11},
//     "06: Upcoming Urban Climbers":{"a":1,"b":2,"c":3,"d":4,"e":5,"f":6,"g":7,"h":8,"i":9,"j":10,"l":11},
//     "07: Striving Urban Climbers":{"a":1,"b":2,"c":3,"d":4,"e":5,"f":6,"g":7,"h":8,"i":9,"j":10,"l":11},
//     "08: Urban Dependants":{"a":1,"b":2,"c":3,"d":4,"e":5,"f":6,"g":7,"h":8,"i":9,"j":10,"l":11},
//     "Grand Total":{"a":1,"b":2,"c":3,"d":4,"e":5,"f":6,"g":7,"h":8,"i":9,"j":10,"l":11},
// }

export const CrossTable_Headers={
    'Urban':{
        'header_names': [
            '<20,000',
           '20,000-40,000',
           '40,000-80,000',
           '80,000-1,30,000',
          '1,30,000-1,70,000',
          '1,70,000-2,30,000',
          '2,30,000-3,00,000',
          '>3,00,000'
       ],
       'span':8
    },
    'Rural':{
        'header_names': [
        '<5,000',
        '5,000 – 10,000',
        '10,000 – 20,000',
        '20,000 – 30,000',
        '30,000 – 40,000',
        '40,000 – 50,000',
        '50,000 –70,000',
        '70,000 – 1,00,000',
        '1,00,000 – 1,30,000',
        '1,30,000 – 1,60,000',
        '1,60,000 – 2,00,000',
        '> 2,00,000'
       ],
       'span':12
    }
   
}

export const CrossTable_Segments_Empty ={
    'Urban':{
        '01: Urban Established Elite': [
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
    ],
    '02: Urban New Wealth': [
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
    ],
    '03: Aspiring Urban Middle Class': [
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
    ],
    '04: Conservative Urban Middle Class': [
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
    ],
    '05: Successful Urban Fast Climbers': [
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
    ],
    '06: Upcoming Urban Climbers': [
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
    ],
    '07: Striving Urban Climbers': [
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
    ],
    '08: Urban Dependants': [
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
    ],
    '09: Daily Urban Survivors': [
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
    ],
    'Grand Total': [
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
    ]},
    'Rural':{
        '01: Traditional Village Elite In Rural': [
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
    ],
    '02: Aspiring Enthusiasts In Rural': [
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
    ],
    '03: Fortunate Climbers In Rural': [
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
    ],
    '04: Rurban New Wealth': [
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
    ],
    '05: Rurban Mainstreamers': [
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
    ],
    '06: Rurban Climbers': [
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
    ],
    '07: Struggling Rural Climbers': [
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
    ],
    '08: Rural Dependants': [
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
    ],
    '09: Daily Rural Survivors': [
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
    ],
    'Grand Total': [
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
        ['', 'white'],
    ]}
}


export const ESI_Segments_For_Filter = {
    "all":"ALL",
    "esi_1":"01: Low INR <20,000",
    "esi_2":"02: Medium Low INR 20,000 – 40,000",
    "esi_3":"03: Medium INR 40,000 – 80,000",
    "esi_4":"04: Medium Good INR 80,000 – 1,30,000",
    "esi_5":"05: Good INR 1,30,000 – 1,70,000 " ,
    "esi_6":"06: Very Good INR 1,70,000 – 2,30,000",
    "esi_7":"07: High INR 2,30,000 – 3,00,000",
    "esi_8":"08: Very High INR > 3,00,000 " 
};

export const LSI_Segments_For_Filter = {
    "all":"ALL",
    "lsi_1":"01: Urban Established Elite",
    "lsi_2":"02: Urban New Wealth",
    "lsi_3":"03: Aspiring Urban Middle Class",
    "lsi_4":"04: Conservative Urban Middle Class",
    "lsi_5":"05: Successful Urban Fast Climbers",
    "lsi_6":"06: Upcoming Urban Climbers",
    "lsi_7":"07: Striving Urban Climbers",
    "lsi_8":"08: Urban Dependants",
    "lsi_9":"09: Daily Urban Survivors"
};


export const LSI_ESI_RT_Segments_For_Filter = {
    'Urban':{
        'LSI':[
            'ALL',
            '01: Urban Established Elite',
                  '02: Urban New Wealth',
                  '03: Aspiring Urban Middle Class',
                  '04: Conservative Urban Middle Class',
                  '05: Successful Urban Fast Climbers',
                  '06: Upcoming Urban Climbers',
                  '07: Striving Urban Climbers',
                  '08: Urban Dependants',
                  '09: Daily Urban Survivors'
        ],
        'ESI':[
            'ALL',
            "01: Low INR <20,000",
        "02: Medium Low INR 20,000 – 40,000",
        "03: Medium INR 40,000 – 80,000",
        "04: Medium Good INR 80,000 – 1,30,000",
        "05: Good INR 1,30,000 – 1,70,000 ",
        "06: Very Good INR 1,70,000 – 2,30,000",
        "07: High INR 2,30,000 – 3,00,000",
        "08: Very High INR > 3,00,000 "
        ],
        'RT':[
            'ALL',
            '01: Cosmopolitan Urban Area',
            '02: Sub-Metropolitan Urban Area',
            '03: Small Urban Area',
            '04: Semi Urban Area'
        ]
    },
    'Rural':{
        'LSI':[
            'ALL',
            '01: Traditional Village Elite In Rural',
            '02: Aspiring Enthusiasts In Rural',
            '03: Fortunate Climbers In Rural',
            '04: Rurban New Wealth',
            '05: Rurban Mainstreamers',
            '06: Rurban Climbers',
            '07: Struggling Rural Climbers',
            '08: Rural Dependants',
            '09: Daily Rural Survivors'
        ],
        'ESI':[
            'ALL',
            '01: Low INR <5,000',
        '02: Medium Low INR 5,000 – 10,000',
        '03: Medium Low INR 10,000 – 20,000',
        '04: Medium INR 20,000 – 30,000',
        '05: Medium INR 30,000 – 40,000',
        '06: Medium Good INR 40,000 – 50,000',
        '07: Medium Good INR 50,000 –70,000',
        '08: Good INR 70,000 – 1,00,000',
        '09: Very Good INR 1,00,000 – 1,30,000',
        '10: High INR 1,30,000 – 1,60,000',
        '11: High INR 1,60,000 – 2,00,000',
        '12: Very High INR > 2,00,000'
        ],
        'RT':[
            '01: Rural'
        ]
    }
}

export const Product_Affinities_For_Filter = {
    'Urban':{
        "lifestyle":"Consumer Segments : Lifestyle",
        "income":"Socio-Economic Profile : Income",
        "regio_type":"Regio-type",
        "inner_regio_type":"Inner City Regio-type",
        "sec_reference":"Consumer Segments : SEC Reference",
        "insurance":"Financial > Insurance",
        "banking":"Financial > Banking",
        "credi_card_holding":"Financial > Banking > Credit Card Holding",
        "special_health_care_target_group":"Consumer Segments > Special Health Care Target Group",
        // "smaller_towns":"Consumer Segments > Lifestyle  Smaller Towns",
        "automobile":"Automobile",
        "real_estate":"Real Estate > Purchase Price Segment",
        "laundry":"FMCG > Laundry",
        "personal_wash":"FMCG > Personal Wash",
        "packaged_food":"FMCG > Packaged Food",
        "cosmetics":"FMCG > Cosmetics",
        "fashion_apparel":"Fashion & Apparel > Purchase Price Category",
        "jewellery_gold":"Jewellery & Gold > Purchase Category",
        "travel_long_term":"Travel Long Term",
        "travel_short_term":"Travel Short Term",
        "retail":"Retail",
        "online_retail":"Online Retail",
        "two_wheeler":"Two Wheeler"
    },
    'Rural':{
        "sec_reference":"Consumer Segments : SEC Reference"
    }
    
};

export const urban_rural ={
    'Urban':'URBAN',
    'Rural':'RURAL'
}


export const LSI_Segments_Array = [
    "01: Urban Established Elite",
    "02: Urban New Wealth",
    "03: Aspiring Urban Middle Class",
    "04: Conservative Urban Middle Class",
    "05: Successful Urban Fast Climbers",
    "06: Upcoming Urban Climbers",
    "07: Striving Urban Climbers",
    "08: Urban Dependants",
    "09: Daily Urban Survivors"
];

export const SummaryTableEmpty = {
    "message": "File uploaded successfully",
    "Urban": {
        "ESI": {
            "01: Low INR <20,000": [
                "",
                "",
                ""
            ],
            "02: Medium Low INR 20,000 – 40,000": [
                "",
                "",
                ""
            ],
            "03: Medium INR 40,000 – 80,000": [
                "",
                "",
                ""
            ],
            "04: Medium Good INR 80,000 – 1,30,000": [
                "",
                "",
                ""
            ],
            "05: Good INR 1,30,000 – 1,70,000 ": [
                "",
                "",
                ""
            ],
            "06: Very Good INR 1,70,000 – 2,30,000": [
                "",
                "",
                ""
            ],
            "07: High INR 2,30,000 – 3,00,000": [
                "",
                "",
                ""
            ],
            "08: Very High INR > 3,00,000 ": [
                "",
                "",
                ""
            ]

        },
        "LSI": {
            "01: Urban Established Elite": [
                "",
                "",
                ""
            ],
            "02: Urban New Wealth": [
                "",
                "",
                ""
            ],
            "03: Aspiring Urban Middle Class": [
                "",
                "",
                ""
            ],
            "04: Conservative Urban Middle Class": [
                "",
                "",
                ""
            ],
            "05: Successful Urban Fast Climbers": [
                "",
                "",
                ""
            ],
            "06: Upcoming Urban Climbers": [
                "",
                "",
                ""
            ],
            "07: Striving Urban Climbers": [
                "",
                "",
                ""
            ],
            "08: Urban Dependants": [
                "",
                "",
                ""
            ],
            "09: Daily Urban Survivors": [
                "",
                "",
                ""
            ]
        }
    },
    "Rural": {
        "ESI": {
            '01: Low INR <5,000': [
                "",
                "",
                ""
            ],
            '02: Medium Low INR 5,000 – 10,000': [
                "",
                "",
                ""
            ],
            '03: Medium Low INR 10,000 – 20,000': [
                "",
                "",
                ""
            ],
            '04: Medium INR 20,000 – 30,000': [
                "",
                "",
                ""
            ],
            '05: Medium INR 30,000 – 40,000': [
                "",
                "",
                ""
            ],
            '06: Medium Good INR 40,000 – 50,000': [
                "",
                "",
                ""
            ],
            '07: Medium Good INR 50,000 –70,000': [
                "",
                "",
                ""
            ],
            '08: Good INR 70,000 – 1,00,000': [
                "",
                "",
                ""
            ],
            '09: Very Good INR 1,00,000 – 1,30,000': [
                "",
                "",
                ""
            ],
            '10: High INR 1,30,000 – 1,60,000': [
                "",
                "",
                ""
            ],
            '11: High INR 1,60,000 – 2,00,000': [
                "",
                "",
                ""
            ],
            '12: Very High INR > 2,00,000': [
                "",
                "",
                ""
            ],

        },
        "LSI": {
            '01: Traditional Village Elite In Rural': [
                "",
                "",
                ""
            ],
            '02: Aspiring Enthusiasts In Rural': [
                "",
                "",
                ""
            ],
            '03: Fortunate Climbers In Rural': [
                "",
                "",
                ""
            ],
            '04: Rurban New Wealth': [
                "",
                "",
                ""
            ],
            '05: Rurban Mainstreamers': [
                "",
                "",
                ""
            ],
            '06: Rurban Climbers': [
                "",
                "",
                ""
            ],
            '07: Struggling Rural Climbers': [
                "",
                "",
                ""
            ],
            '08: Rural Dependants': [
                "",
                "",
                ""
            ],
            '09: Daily Rural Survivors': [
                "",
                "",
                ""
            ]
        }
    }
}



export const empty_chart_data ={'labels': [],
 'datasets': [{'label': ['Count'],
   'data': [],
   'backgroundColor': ['rgba(20, 203, 24, 0.7)'],
   'borderColor': ['rgba(20, 203, 24, 1)'],
   'borderWidth': 1}]};

export const chart_options = {
  
    scales: {
      y: {
        beginAtZero: true,
        // suggestedMax: 100
      },
      
    },
    responsive: false,
    plugins: {
      legend: {
          display: false,
          position:"right",
          labels: {
            color: "rgba(255, 99, 132, 1)"
          }
      }
      }
  }

//   export const summary_table_colors_lsi_esi = {
//     "01: Low INR <20,000": "rgba(128, 2, 2, 1)",
//     "02: Medium Low INR 20,000 – 40,000": "rgba(255, 0, 0, 1)",
//     "03: Medium INR 40,000 – 80,000": "rgba(204, 83, 0, 1)",
//     "04: Medium Good INR 80,000 – 1,30,000": "rgba(255, 153, 51, 1)",
//     "05: Good INR 1,30,000 – 1,70,000 ": "rgba(255, 255, 0, 1)",
//     "06: Very Good INR 1,70,000 – 2,30,000": "rgba(204, 204, 0, 1)",
//     "07: High INR 2,30,000 – 3,00,000": "rgba(0, 176, 240, 1)",
//     "08: Very High INR > 3,00,000 ": "rgba(0, 112, 192, 1)",
//     "01: Urban Established Elite": "rgba(243, 190, 29, 1)",
//     "02: Urban New Wealth": "rgba(228, 128, 36, 1)",
//     "03: Aspiring Urban Middle Class": "rgba(208, 36, 33, 1)",
//     "04: Conservative Urban Middle Class": "rgba(207, 30, 116, 1)",
//     "05: Successful Urban Fast Climbers": "rgba(114, 18, 129, 1)",
//     "06: Upcoming Urban Climbers": "rgba(91, 24, 104, 1)",
//     "07: Striving Urban Climbers": "rgba(42, 51, 119, 1)",
//     "08: Urban Dependants": "rgba(65, 114, 171, 1)",
//     "09: Daily Urban Survivors": "rgba(95, 182, 220, 1)"
// }

export const summary_table_colors_lsi_esi = {
    "01: Low INR <20,000": "",
    "02: Medium Low INR 20,000 – 40,000":"",
    "03: Medium INR 40,000 – 80,000": "",
    "04: Medium Good INR 80,000 – 1,30,000": "",
    "05: Good INR 1,30,000 – 1,70,000 ": "",
    "06: Very Good INR 1,70,000 – 2,30,000":"",
    "07: High INR 2,30,000 – 3,00,000": "",
    "08: Very High INR > 3,00,000 ": "",
    "01: Urban Established Elite": "",
    "02: Urban New Wealth": "",
    "03: Aspiring Urban Middle Class":"",
    "04: Conservative Urban Middle Class": "",
    "05: Successful Urban Fast Climbers": "",
    "06: Upcoming Urban Climbers": "",
    "07: Striving Urban Climbers":"",
    "08: Urban Dependants": "",
    "09: Daily Urban Survivors": "",
}

export const empty_column_names={"No Filters":"No Filters"};
export const empty_column_values={"No Filters":["All Data"]};
export const empty_filter_value = ["All Data"];
export const empty_filter_cat = "No Filters";

export const BACKEND_URL = "http://localhost:5000"
// export const BACKEND_URL = "/api"
