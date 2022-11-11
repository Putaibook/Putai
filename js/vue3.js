
const app = {
  data(){
  return {
    //訂購人資料
    custom_data : {
      name : "",
      mail: "",
      phone: "",
    }, 
    purchaseType : "",
    //書本資料
    book_data : [
      book_k = book.kbook,
      book_n = book.nbook,
      book_h = book.hbook,
      book_k_partice = book.kpratice,
      book_n_partice = book.npratice,
      book_h_partice = book.hpratice,
      workbook_k = book.kworkbook,
      workbook_n = book.nworkbook,
      workbook_h = book.hworkbook
    ],
    // 月考試題
    exam_data : {
      extra_purchase3_grade: "",
      extra_purchase3_num: "",
      choose_elementary: "",
      other_elementary: "",
      purchase3_list:[
       "海山國小",
       "中山國小",
       "實踐國小",
       "光仁國小",
       "重慶國小",
       "自強國小",
       "後埔國小",
       "板橋國小",
       "裕德國小",
       "其他"
     ],
      purchase3_comfirm_list: [],
      warning_text: "",
    },
      placeholder: "",
      filter_grade: "",
      filter_subject: '',
      filter_type: '',
    submission : [],
    send: [],
    senior: false
    }
     },
  methods:{
    clear(){
      $("filter_radio:selected").attr("selected",false);
    },
    purchase3_list_add(){
      const exam = this.exam_data;
      
      // let check_format = "國小";
      let elem = exam.choose_elementary === "其他" ? exam.other_elementary:exam.choose_elementary;
      if(elem.indexOf("國小") == -1){
        exam.warning_text = "格式錯誤，請輸入正確格式 (例: XX國小)";
        return false;
      }else{
        // this.warning_text = "";
        let result = `${exam.extra_purchase3_grade}年級${elem}月考模擬試題 ${exam.extra_purchase3_num}本`;
        let newobj = {
          result: result,
          name: `${elem}${exam.extra_purchase3_grade}年級月考模擬試題`,
          grade: exam.extra_purchase3_grade,
          publish:"弘基",
          num: exam.extra_purchase3_num,
          edition: "其他"
        }
      exam.purchase3_comfirm_list.push(result);
      this.send.push(newobj);

    }
},
    remove_purchaselist(list){
      const txt_list = this.exam_data.purchase3_comfirm_list;
      const send = this.send;
      let index = txt_list.indexOf(list);
      txt_list.splice(index,1);

      for(let i=0;i<send.length;i++){
        if(send[i].result === list){
          send.splice(i,1);
        }
      }
    },
    being_select(event,index,content){

    let count = event.currentTarget.value;
    let res = `${content} ${count} 本`;
    this.val.push(res);
},
    dototalstatis(){
      this.submission = [];
      let purchase = [];
      const book_data = this.book_data;
      const exam = this.exam_data.purchase3_comfirm_list;
      for(let i=0;i<book_data.length;i++){
        for(let j=0;j<book_data[i].product.length;j++){
          if(book_data[i].product[j].num > 0){
            purchase.push(`${book_data[i].product[j].name} * ${book_data[i].product[j].num}本`);
          }
        }
      }
       this.submission = purchase.concat(exam);

    },
    //ajax 絕對不要動
    submitdata(){
      //條件判斷
      const book_data = this.book_data;
      const custom = this.custom_data;
      let purchase;

      if(!custom.name){
        alert("請輸入您的姓名");
        $("html,body").animate({scrollTop:($("#name").offset().top)-100},500);
        $(".inputname").focus();
        return false;
      }else if(!custom.mail){
        alert("請輸入你的電子郵件");
        $("html,body").animate({scrollTop:($("#custom_email").offset().top)-100},500);
        $(".inputmail").focus();
        return false;
      }else if(custom.phone == "" || custom.phone.match(/^0\d{9}/)  == null){
        $("html,body").animate({scrollTop:($("#phone").offset().top)-100},500);
        $(".inputphone").focus();
        alert("電話未填寫或格式錯誤");
        return false;
      }else if(custom.custom_group == ""){
        alert("請選擇您所在的群組");
        $("html,body").animate({scrollTop:($("#custom_group").offset().top)-100},500);
        $(".inputgroup").focus();
        return false;
      }
      // 判斷有無選購
      if(this.submission.length === 0 && this.senior ==  false){
        purchase = "無訂購項目";
        alert("無訂購項目，訂購失敗\n請選擇要訂購的項目或勾選僅訂購國中產品的按鈕");
        return false;
      }else if(this.submission.length === 0 && this.senior == true){

        purchase = "僅訂購國中項目";
      }else{
        purchase = this.submission.join("\n");
      }
      for(let i=0;i<book_data.length;i++){
        for(let j=0;j<book_data[i].product.length;j++){
          if(book_data[i].product[j].num > 0){
            this.send.push(book_data[i].product[j]);
          }
        }
      }
      const url = "https://script.google.com/macros/s/AKfycbxhewFRO9But-pY2MtKR0TsBfi2j1zbsYUorubQ7IBd/dev";
      const send_data =  {
      name : custom.name,
      phone : custom.phone,
      group : custom.custom_group,
      email : custom.mail,
      purchase : purchase,
      statics: JSON.stringify(this.send),
      lengths: this.send.length
    }

      if(confirm("確定要送出表單嗎?")){
        {  $.ajax({
              type: "get",
              url: url,
              data:  send_data,
              // 資料格式是JSON
              dataType: "JSON",
              // 成功送出 會回頭觸發下面這塊感謝
              success: function(responseText) {
                  console.log('responseURL:')},
              error: function (err) {
                if(err.status == 200||302){
                  alert("表單已成功寄出");
                    document.write("感謝您的訂購");
                }
                console.log(send_data);
                console.log(err.status,12346);
              }
            })}  }
    console.log(purchase,this.submission);

    // console.log(send_data.statics);
},
    grade(data){
              const grade = this.filter_grade;
              return grade == "" ? true:data.grade == grade;
            },
    subject(data){
              const subject = this.filter_subject;
              return subject == "" ? true:data.subject == subject;
            },
    type(data){
              const type = this.filter_type;
              return type == "" ? true:data.type == type;
            },
    clearfilter(){
      this.filter_grade = "";
      this.filter_subject = "";
      this.filter_type = "";
      clear()
    }
  },
  computed :{
    issenior(){
      return this.senior ? "僅訂購國中產品" : ""
    },
    isother(){
      const exam = this.exam_data;
      exam.other_elementary = "";
      if(exam.choose_elementary === "其他"){
        this.placeholder = "請輸入國小"
        return false
      }else{
        this.placeholder = "";
        return true;
      }
    }

  }
  }



Vue.createApp(app).mount("#container");
