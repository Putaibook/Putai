let modal;


const app = {
  data() {
    return {
      //訂貨人資料
      custom_data: {
        name: "",
        phone: "",
        mail: "",
      },
      purchaseType : "",
      purchaseType_Text : "",
      //書本資料
      book_data: {
        books: books,
        lecture: lecture,
        workbook: workbook.concat(praticebook),
      },
      filter_data: {
        edition: "",
        grade: "",
        subject: "",
        type: "",
      },
      //月考試題
      exam_data: {
        grade: "",
        school: "",
        school_list: [...schoolList],
        confirmList: [],
        placeholder: "",
        warningText: "",
      },
      totalBooks : books.concat(workbook,praticebook,lecture),
      warningText:{
        name: false,
        mail: false,
        phone: false
      },
      isConfirm : false,
    };
  },
  methods: {
    //篩選器
    grade(book) {
      return this.filter_data.grade
        ? book.grade == this.filter_data.grade
        : true;
    },
    edition(book) {
      return this.filter_data.edition
        ? book.edition == this.filter_data.edition
        : true;
    },
    subject(book) {
      return this.filter_data.subject
        ? book.subject == this.filter_data.subject
        : true;
    },
    type(book) {
      return this.filter_data.type ? book.type == this.filter_data.type : true;
    },
    resetFilter() {
      const el = this.filter_data;
      el.edition = "";
      el.grade = "";
      el.subject = "";
      el.type = "";
    },
    //月考試題
    addExam() {
      const grade = document.querySelector(".examGrade").value;
      let school = document.querySelector(".examOtherSchool").value;
      const num = document.querySelector(".examNum").value;

      this.exam_data.warningText = "";
      //
      !this.isOther ? (school = school) : (school = this.exam_data.school);
      //是否為空值
      if (!grade) return (this.exam_data.warningText = "請選擇年級!!");
      else if (!school && !this.exam_data.school)
        return (this.exam_data.warningText = "請選擇或填寫國小!!");
      //國小格式是否正確 非數字
      else if (
        (school.indexOf("實小") === -1 && school.indexOf("國小") === -1) ||
        /\d/.test(school)
      )
        return (this.exam_data.warningText = "請填寫正確的格式!!");
      //數量不能為0
      else if (num < 1)
        return (this.exam_data.warningText = "請填寫需要的數量");

      const obj = { grade, school, num:+num ,publisher:"宏碁",name:`${grade}年級 ${school}模擬月考試題`};

      this.exam_data.confirmList.push(obj);
    },
    removeExam(data) {
      let index = -1;
      this.exam_data.confirmList.forEach((el, idx) => {

        el.grade === data.grade &&
        el.school === data.school &&
        el.num === data.num
          ? (index = idx)
          : (index = index);
      });

      if(index >= 0)this.exam_data.confirmList.splice(index,1)

    },
    isSelect(books){
      
      return books.num > 0

      // let isZero = false;
      // if(book.num <= 0 || !book)!isZero

      // let index = -1
      // arr.forEach((x,idx)=>{
      //   if(x.name === book.name){
      //     index = idx;
      //   }
      // })
      // //沒有書且數量<0
      // if(index < 0 && isZero) return
      // //有書 數量<0就把書從陣列移除，反之重新復職數量
      // else if(index >0) isZero ? arr.splice(index,1): arr[index].num = book.num
      // //若都沒有就新增
      // else arr.push(book)
      // console.log(arr)
    },
    openModal(){
      modal.show();
    },
    closeModal(){
      modal.hide();
      this.isConfirm = false;
    },
    //送表單
    conFirm(){
  
      const c = this.custom_data;
      //customInfo
      if(!c.name)return this.isFocus("name");
      else if(!c.mail)return this.isFocus("mail");
      else if(!c.phone)return this.isFocus("phone");
      //hasPurchase?
      const arr = this.totalBooks.filter(x=>x.num>=1).concat(this.exam_data.confirmList);
      
      if(arr.length < 1 && this.purchaseType !== "senior"){
        alert("無選購項目，請重新確認!");
        return
      }  
      // purchaseType !== `senior` ? 
      // if(!this.isConfirm){
      //   this.isConfirm = true
      //   alert("請再一次確認訂購的項目是否有誤，沒有的話請再次點擊送出表單");
      // }else{

      this.isConfirm ?  this.submitData(arr):this.openModal();
      },
      submitData(orders){
        this.closeModal();

        const url = "https://script.google.com/macros/s/AKfycbyBYKQYx5MpPqhkz0nvhMg9nl05vEvJvxPEpDuVSP-DxPNHN1pipse1i6QJZhFcOWFttg/exec";
        const data = {
          name : this.custom_data.name,
        email : this.custom_data.mail,
        phone : this.custom_data.phone,
        statics : JSON.stringify(orders)
      }

    $.ajax({
      type: "get",
      url: url,
      data: data,
      // 資料格式是JSON
      dataType: "JSON",
      crossDomain: true,
      // 成功送出 會回頭觸發下面這塊感謝
      success: function(responseText) {
          console.log('responseURL:')},
      error: function (err) {
        if(err.status == 200||302){
          alert("表單已成功寄出");
            document.write("感謝您的訂購");
        }
        console.log(err);
      }
    })
},
    isFocus(v){
      this.warningText[`${v}`] = true;
      document.querySelector(`#custom_${v}`).focus();
    },
  },

  computed: {
    isOther() {
      const exam = this.exam_data;
      if (exam.school !== "other") {
        exam.placeholder = "";
        return true;
      } else {
        exam.placeholder = "請輸入國小(XX國小)";
        return false;
      }
    },
    isSenior(){
      this.purchaseType_Text = this.purchaseType !== "senior" ? "含訂購國中項目一批!" : "僅訂購國中項目一批!" ;
      if(!this.purchaseType || this.purchaseType === 'elem') this.purchaseType_Text = "";
      return this.purchaseType_Text;
    }
  },
  mounted(){
    modal = new bootstrap.Modal(document.getElementById('orderModal'), {
      keyboard: false,
      backdrop: false
    })
  }
};

Vue.createApp(app).mount("#container");
