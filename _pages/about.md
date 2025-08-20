---
permalink: /about/
title: "Wing🪽"
excerpt: ""
author_profile: true
---

{% if site.google_scholar_stats_use_cdn %}
{% assign gsDataBaseUrl = "https://cdn.jsdelivr.net/gh/" | append: site.repository | append: "@" %}
{% else %}
{% assign gsDataBaseUrl = "https://raw.githubusercontent.com/" | append: site.repository | append: "/" %}
{% endif %}
{% assign url = gsDataBaseUrl | append: "google-scholar-stats/gs_data_shieldsio.json" %}

{% if page.author and site.data.authors[page.author] %}
  {% assign author = site.data.authors[page.author] %}{% else %}{% assign author = site.author %}
{% endif %}

<span class='anchor' id='about-me'></span>

# Hi There!
I'm Ying Zhong. You can call me Wing—that’s how it’s pronounced in Cantonese. 

I'm a PhD student at Department of Human-Centered Computing, Indiana University. I work with Prof.Ekaterina Muravevskaia in the SETH Lab. 

I completed my MA in Film Production Studies and BEng in Digital Media Technology at the School of Intelligent Imagery Engineering, Beijing Film Academy. During my MA and BEng Studies, I worked with [Dr. Feilin Han](http://feilinh.cn) in Virtual Reality Lab.


<div class="notification-box">
<div class='notification-box-text' markdown="1">
📢 I am seeking collaboration opportunities. If you are interested in my research or would like to collaborate, please feel free to <a href="mailto:{{ author.email }}">reach out</a>.
</div>
</div>

<div class="highlight-blocks">
<div class="highlight-block">
    <h3>HCI Researcher</h3>
    <ul>
      <li>Empathy</li>
      <li>VR, AR and XR</li>
      <li>Interaction Design</li>
    </ul>
  </div>
  
  <div class="highlight-block">
    <h3><em>Former</em> Digital Media Artist</h3>
    <ul>
      <li>Immersive Content</li>
      <li>Virtual Production</li>
      <li>Photography</li>
    </ul>
  </div>
</div>

<!--My research interest includes neural machine translation and computer vision. I have published more than 100 papers at the top international AI conferences with total <a href='https://scholar.google.com/citations?user=DhtAFkwAAAAJ'>google scholar citations <strong><span id='total_cit'>260000+</span></strong></a> (You can also use google scholar badge <a href='https://scholar.google.com/citations?user=DhtAFkwAAAAJ'><img src="https://img.shields.io/endpoint?url={{ url | url_encode }}&logo=Google%20Scholar&labelColor=f6f6f6&color=9cf&style=flat&label=citations"></a>).-->

# LATEST NEWS
- *2025/04*: Attending CHI25 in Yokohama :D
- *2024/03*: New paper is accepted by ICME 2024 :)

# EDUCATIONS
- *2025/08 - Now*, PhD, Indiana University Indianapolis, IN
- *2022/09 - 2025/07*, MA, Beijing Film Academy, Beijing
- *2018/09 - 2022/06*, BEng, Beijing Film Academy, Beijing

# AWARDS & SERVICES
- *2024/12*, National Scholarship (Top 3%)
- *2022/01 - 2022/03*, Professional Photography Volunteer, *Beijing Olympic and Paralympic Winter Games*
- *2019/05 - 2020/12*, Technical Volunteer, *International Student Film and Video Festival (ISFVF)*


