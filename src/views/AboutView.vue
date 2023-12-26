<template>
  <div class="aboutWrap contentWrap">
    <div class="avatarWrap">
      <div class="titleWrap">
        <h1>Jasmin</h1>
        <h3>Front-end engineer</h3>
      </div>
      <div class="avatar">
        <img src="/img/231222.jpg" alt="" />
      </div>
    </div>
    <div class="mainWrap">
      <div class="item">
        <p><n-icon :component="AccountCircleSharp" /> 關於我</p>
        <ul class="detailed">
          <li>軟體工程師</li>
          <li>三年網頁前端開發</li>
          <li>過去一年勝任5人的開發團隊領導職務</li>
        </ul>
      </div>
      <div class="item">
        <p><n-icon :component="CalligraphyPen24Regular" />技能</p>
        <ul class="detailed">
          <li>
            Front-end： HTML5 / CSS3 / Scss / RWD響應式網頁設計 / jQuery /
            JavaScript / TypeScript / Vue3.js / React
          </li>
          <li>Communication： HTTP / MQTT</li>
          <li>Database： MS SQL / MySQL</li>
          <li>Other： IIS / nginx / Git / SVN</li>
        </ul>
      </div>
      <div class="item">
        <p><n-icon :component="BookToolbox20Regular" />經歷</p>
        <ul class="detailed">
          <li>研發工程師 - 天茶智能科技 Sep 2020 - Feb 2024</li>
        </ul>
      </div>
    </div>
    <div class="decorate"></div>
  </div>
</template>
<script setup lang="ts">
import { AccountCircleSharp } from "@vicons/material";
import { CalligraphyPen24Regular, BookToolbox20Regular } from "@vicons/fluent";
</script>
