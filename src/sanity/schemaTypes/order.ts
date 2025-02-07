

export default{
    name:'order',
    type:'document',
    title:'Order',
    fields:[
        {
            name:'firstname',
            title:'FirstName',
            type:'string'
        },
      {
        name:'lastname',
        title:'LastName',
        type:'string'
      },
      {
        name:'address',
        title:'Address',
        type:'string'
      },
      {
        name:'city',
        title:'City',
        type:'string'
      },
      {
        name:'zipCode',
        title:'Zip Code',
        type:'string'
      },
      {
        name:'phone',
        title:'Phone',
        type:'string'
      },
      {
        name:'email',
        title:'Email',
        type:'string'
      },
      {
        name:'cartItems',
        title:'Cart Items',
        type:'array',
        of:[{type:'reference', to: {type:'products'}}]
      },
      {
        name:'totalPrice',
        title:'Total Amount',
        type:'number'
      },
      {
        name:"discountPercent",
        title:"Discount Percent",
        type: 'number',
    },
      {
        name:'orderStatus',
        title:'Order Status',
        type:'string',
        options:{
            list:[
                {title:'Pending', value:'pending'},
                {title:'Processing', value:'processing'},
                {title:'Shipped', value:'shipped'},
                {title:'Delivered', value:'delivered'},
                {title:'Cancelled', value:'cancelled'}
            ],
            layout:'radio'
        },
        initialValue:'pending'
      }
, {
  name:'paymentMethod',
  title:'Payment Method',
  type:'string',
  options:{
      list:[
          {title:'Credit Card', value:'creditCard'},
          {title:'PayPal', value:'paypal'},
          {title:'Bitcoin', value:'bitcoin'}
      ],
      layout:'radio'
  },
  initialValue:'creditCard'
},
{
  name:'orderDate',
  title:'Order Date',
  type:'date'
}

    ]
}