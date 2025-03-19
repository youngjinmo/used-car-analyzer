<template>
  <div class="container">
    <!-- 로고 -->
    <div class="logo"><img src="./assets/logo.png" alt="logo"></div>

    <!-- 검색창 -->
    <div class="search-box">
      <button id="goEncarBtn" @click="goEncar">엔카 가기</button>
      <input type="text" v-model="carUrl" class="search__input" placeholder="확인하고 싶은 차량의 상세페이지 주소를 붙여넣어주세요.">
      <button id="heyGptBtn" @click="analyzeCar">살까 말까</button>
    </div>

    <!-- 분석 결과 -->
    <div v-if="responseByGpt" class="result-box">
      <img v-if="carImg" :src="carImg" alt="car image" style="width: 50%; min-width: 100px;">
      <h2>by ChatGPT</h2>
      <h4>{{ carTitle }}</h4>
      <p>{{ responseByGpt }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'App',
  data() {
    return {
      carUrl: "",
      carImg: "",
      carTitle: "",
      responseByGpt: "",
    };
  },
  methods: {
    goEncar() {
      const isMobile = window.innerWidth <= 768;
      const mobileEncarLink = "https://car.encar.com";
      const desktopEncarLink = "https://www.encar.com/dc/dc_carsearchlist.do";

      if (isMobile) {
        window.open(mobileEncarLink);
      } else {
        window.open(desktopEncarLink);
      }
    },
    analyzeCar() {
      if (!this.carUrl.trim()) {
        alert("차량 상세페이지 주소를 입력해주세요.");
        return;
      }

      this.responseByGpt = "분석 중입니다. 잠시만 기다려주세요...";

      // request api
      axios.post(`/api/v1/openai/parse/encar?url=${this.carUrl}`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      })
          .then((res) => {
            const carName = res.data.carName || "알수없음";
            const carYear = res.data.carYear || "알수없음";
            const carMileage = res.data.carMileage ? Intl.NumberFormat('en-US').format(res.data.carMileage) : "알수없음";
            const carPrice = res.data.carPrice ? Intl.NumberFormat('en-US').format(res.data.carPrice) : "알수없음";
            const fuelType = res.data.fuelType || "알수없음";

            this.carImg = res.data.carImg || "./assets/no_car_image_available.png";
            this.carTitle = `${carName} (${carYear}), ${carMileage}km, ${carPrice}만원, ${fuelType}`;
            this.responseByGpt = res.data.response || "응답을 가져오지 못했습니다.";
          })
          .catch((e) => {
            if (e.status === 400) {
              alert("차량 상세페이지 주소를 입력해주세요.");
            } else if (e.status === 404) {
              this.responseByGpt = e.message;
            } else {
              alert(e.message);
            }
          });
    }
  },
}

</script>

<style scoped>

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
}

.logo {
  img {
    width: 250px;
  }
  font-size: 48px;
  font-weight: bold;
}

.search__input::placeholder {
  font-size: 0.8em;
}
.search-box {
  display: flex;
  gap: 10px;
}

input {
  word-break: keep-all;
  width: 300px;
  padding: 10px;
  font-size: 16px;
  border: 2px solid #ccc;
  border-radius: 5px;
  outline: none;
}

button {
  word-break: keep-all;
  padding: 10px 15px;
  font-size: 16px;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

#goEncarBtn {
  background-color: #D72E36;
}
#goEncarBtn:hover {
  background-color: #fa000c;
}

#heyGptBtn {
  background-color: #007bff;
}
#heyGptBtn:hover {
  background-color: #0056b3;
}

.result-box {
  word-break: keep-all;
  margin-top: 20px;
  padding: 10px;
  width: 60%;
  border: 1px solid #ddd;
  background-color: #f9f9f9;
  border-radius: 5px;
}

@media (max-width: 768px) {
  .logo img {
    width: 45%;
  }

  .search-box {
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
  .search-box input {
    font-size: 12px;
  }

  .search-box button {
    font-size: 12px;
  }

  .result-box {
    width: 80%;
    font-size: 11px;
  }
}
</style>
