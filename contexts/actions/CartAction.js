import axios from "axios";
import { handleError } from '../../utils/fn';

const backendUrl = process.env.BACKEND_URL;
const SHIPPING_TOKEN = process.env.SHIPPING_TOKEN;
const ACTIONS = {
    SET_LOADING: 'SET_LOADING',
    SET_MESSAGE: 'SET_MESSAGE',
    SET_ERROR: 'SET_ERROR',
    SET_LOADCART:'SET_LOADCART',
    SET_LOADCARTBYUSERID:'SET_LOADCARTBYUSERID',
    SET_DELETECARTITEM:'SET_DELETECARTITEM',
    SET_UPDATEQUANTITY:'SET_UPDATEQUANTITY',
    SET_ADDRESSES:'SET_ADDRESSES'
}

const updateCartItemAction = (cartItem,id) => async (dispatch)=>{
  await axios({
    method:'PUT',
    url:`${backendUrl}/cartitems/${id}`,
    data:cartItem
  }).then((response)=>{
    dispatch({
      type:ACTIONS.SET_UPDATEQUANTITY,
      payload:{
        data:response.data.data
      }
 }   )
  }).catch((error) => {
    handleError(error, dispatch, ACTIONS.SET_ERROR);
  });
}

const deleteCartItemAction =(selected)=>async (dispatch)=>{
  await axios({
    method: 'DELETE',
    url: `${backendUrl}/cartitems`,
    data: [selected]
  }).then((response) => {
    console.log(response);
  }).catch((error) => {
    handleError(error, dispatch, ACTIONS.SET_ERROR);
  });
}

const loadCartAction = (cartid) => async(dispatch) =>{
    await axios({
        method:'GET',
        url:`${backendUrl}/cartitems/cartid/${cartid}`,
    }).then((response)=>{
        dispatch({
            type:ACTIONS.SET_LOADCART,
            payload:{
                data:response.data.data,
                message:response.data.message,
                success:response.data.success
            }
        })
    }).catch((error)=>{
        handleError(error,dispatch,ACTIONS.SET_ERROR)
    })
}
const loadCartByUserIdAction = (userId) => async(dispatch)=>{
    await axios({
        method:'GET',
        url:`${backendUrl}/carts/${userId}`
    }).then((response)=>{
        dispatch({
            type:ACTIONS.SET_LOADCARTBYUSERID,
            payload:{
                data:response.data.data,
                message:response.data.message,
                success:response.data.message
            }
        })
    })
}
const loadAddressesAction = () => async (dispatch) => {
    await axios({
      method: "GET",
      url: `${backendUrl}/contacts/byUser`,
      params: {
        sort: "priority__DESC"
      }
    })
      .then(async (response) => {
        // set url data
  
        axios.defaults.baseURL = "https://online-gateway.ghn.vn/shiip/public-api";
        axios.defaults.headers.common["token"] = SHIPPING_TOKEN;
  
        // each item in address info
  
        const { data } = response.data;
  
        for (var i = 0; i < data.length; i++) {
          // set province name
          await axios
            .get("/master-data/province")
            .then(function (response) {
              const provinceName = response.data.data.find(
                (item) => item.ProvinceID == data[i].province
              ).ProvinceName;
              data[i].province_name = provinceName;
            })
            .catch(function (error) {
              console.error(error);
            });
  
          // set district name
          await axios
            .get("/master-data/district", {
              params: {
                province_id: data[i].province,
              },
            })
            .then(function (response) {
              const districtName = response.data.data.find(
                (item) => item.DistrictID == data[i].district
              ).DistrictName;
              data[i].district_name = districtName;
            })
            .catch(function (error) {
              console.error(error);
            });
  
          // set ward name
          await axios
            .get("/master-data/ward", {
              params: {
                district_id: data[i].district,
              },
            })
            .then(function (response) {
              const wardName = response.data.data.find(
                (item) => item.WardCode == data[i].ward
              ).WardName;
              data[i].ward_name = wardName;
            })
            .catch(function (error) {
              console.error(error);
            });
        }
        dispatch({
          type: ACTIONS.SET_ADDRESSES,
          payload: data,
        });
      })
      .catch((error) => {
        handleError(error, dispatch, ACTIONS.SET_ERROR);
      });
  };
export {
    ACTIONS,
    loadCartAction,
    loadCartByUserIdAction,
    loadAddressesAction,
    deleteCartItemAction,
    updateCartItemAction
}