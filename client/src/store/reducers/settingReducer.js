import {
  SETING_LOADING,
  SETTING_SUCCESS,
  SETTING_FAIL,
  LIST_DATE_FORMAT,
} from "../action/settingAction";

const initialState = {
  settings: {
    appearance: {
      home: {
        slider: [
          {
            image: {
              medium:
                "/assets/images/setting/thumbnail/1591444452114-slider3.jpg",
            },
            link: "",
            open_in_tab: false,
          },
        ],
        add_section_in_home: {
          feature_product: true,
          recently_added_products: false,
          most_viewed_products: false,
          recently_bought_products: false,
          product_recommendation: false,
          products_on_sales: false,
          product_from_specific_categories: false,
        },
      },
      theme: {
        primary_color: "#154050",
        logo: {
          original: "",
          large: "",
          medium:
            "/assets/images/setting/thumbnail/1593086526361-1591444474817-slider2.jpg",
          thumbnail:
            "/assets/images/setting/thumbnail/1593086531498-1591603300083-slider1.jpg",
        },
      },
    },
  },
  date_formats: [],
  loading: false,
  success: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SETING_LOADING:
      return {
        ...state,
        loading: true,
      };
    case LIST_DATE_FORMAT:
      return {
        ...state,
        date_formats: action.payload,
        loading: false,
      };
    case SETTING_SUCCESS:
      return {
        ...state,
        settings: action.payload,
        loading: false,
      };
    case SETTING_FAIL:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
};
