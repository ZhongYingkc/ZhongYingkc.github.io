---
permalink: /
title: "Wing🪽"
excerpt: ""
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---

{% if site.google_scholar_stats_use_cdn %}
{% assign gsDataBaseUrl = "https://cdn.jsdelivr.net/gh/" | append: site.repository | append: "@" %}
{% else %}
{% assign gsDataBaseUrl = "https://raw.githubusercontent.com/" | append: site.repository | append: "/" %}
{% endif %}
{% assign url = gsDataBaseUrl | append: "google-scholar-stats/gs_data_shieldsio.json" %}

<span class='anchor' id='about-me'></span>
# <img src="/images/wing.svg" alt="Wing Logo" width="3.5%"> Welcome to Wing's Homepage
I'm Ying Zhong, but just call me Wing—that’s how it’s pronounced in Cantonese. I'm a third-year Master’s student at the China Film High Tech Research Institute, Beijing Film Academy, where I also completed my BEng in Digital Media Technology. 

Currently, I’m working with [Dr. Feilin Han](http://feilinh.cn) in Virtual Reality Lab, diving into the exciting world of immersive media and exploring  the creative possibilities of VR.

<div class="highlight-blocks">
<div class="highlight-block">
    <h3>💻 HCI Researcher</h3>
    <ul>
      <li>VR, AR and XR</li>
      <li>User Perception</li>
      <li>Interaction Design</li>
    </ul>
  </div>
  
  <div class="highlight-block">
    <h3>🧩 <em>Former</em> Digital Media Artist</h3>
    <ul>
      <li>Immersive Content</li>
      <li>Virtual Production</li>
      <li>Photography</li>
    </ul>
  </div>
</div>

<!--My research interest includes neural machine translation and computer vision. I have published more than 100 papers at the top international AI conferences with total <a href='https://scholar.google.com/citations?user=DhtAFkwAAAAJ'>google scholar citations <strong><span id='total_cit'>260000+</span></strong></a> (You can also use google scholar badge <a href='https://scholar.google.com/citations?user=DhtAFkwAAAAJ'><img src="https://img.shields.io/endpoint?url={{ url | url_encode }}&logo=Google%20Scholar&labelColor=f6f6f6&color=9cf&style=flat&label=citations"></a>).-->

# 🎓 Educations
- *2022/09 - 2025/07 (Expected)*, MA, Beijing Film Academy, Beijing. 
- *2018/09 - 2022/06*, BEng, Beijing Film Academy, Beijing.

# 🎖 Honors and Services
- *2024/12* National Scholarship (Top 3%)
- *2022/01 - 2022/03* Photography Volunteer, *Beijing Olympic and Paralympic Winter Games*
- *2019/05 - 2020/12* Technical Volunteer, *International Student Film and Video Festival (ISFVF)*


# 💡 Publications 
{% if page.author and site.data.authors[page.author] %}
  {% assign author = site.data.authors[page.author] %}{% else %}{% assign author = site.author %}
{% endif %}
You can find all my articles on <u><a href="{{author.googlescholar}}">my Google Scholar profile</a>.</u>

<div class='paper-box'><div class='paper-box-image'><div><div class="badge">ICME 2024</div><img src='images/handCS.png' alt="sym" width="100%"></div></div>
<div class='paper-box-text' markdown="1">

<h4>The Correlation Analysis Between Cybersickness and Postural Behavior in Immersive VR Experience</h4>

**Ying Zhong**, Ke-Ao Zhao, Leping Zhang, Fangming Zhao, Wentao Wei and Feilin Han

<!--[**Project**](https://scholar.google.com/citations?view_op=view_citation&hl=zh-CN&user=DhtAFkwAAAAJ&citation_for_view=DhtAFkwAAAAJ:ALROH1vI_8AC) <strong><span class='show_paper_citations' data='DhtAFkwAAAAJ:ALROH1vI_8AC'></span></strong>-->
- This work investigates the relationship between cybersickness and hand posture behavior.
- [[link]](https://doi.org/10.1109/ICME57554.2024.10687394) 
</div>
</div>

<div class='paper-box'><div class='paper-box-image'><div><div class="badge">HCMA 2023</div><img src='images/viewbehavior.png' alt="sym" width="100%"></div></div>
<div class='paper-box-text' markdown="1">

<h4>An Analytical Study of Visual Attention Behavior in Viewing Panoramic Video</h4>

Feilin Han, **Ying Zhong** and Ke-Ao Zhao

<!--[**Project**](https://scholar.google.com/citations?view_op=view_citation&hl=zh-CN&user=DhtAFkwAAAAJ&citation_for_view=DhtAFkwAAAAJ:ALROH1vI_8AC) <strong><span class='show_paper_citations' data='DhtAFkwAAAAJ:ALROH1vI_8AC'></span></strong>-->
- This work investigates viewing behavior, summarize attention distribution regulations and derive practical insights into the aspects of learning decision-making for panorama production.
- [[link]](https://doi.org/10.1145/3606041.3618060) [[PDF]](/images/hcma23.pdf)
</div>
</div>

<div class='paper-box'><div class='paper-box-image'><div><div class="badge">ICME 2022</div><img src='images/cvr.png' alt="sym" width="100%"></div></div>
<div class='paper-box-text' markdown="1">

<h4>Evaluating the Effect of Cinematography on the Viewing Experience in Immersive Environment</h4>

Feilin Han, **Ying Zhong** and Minxi Zhou

<!--[**Project**](https://scholar.google.com/citations?view_op=view_citation&hl=zh-CN&user=DhtAFkwAAAAJ&citation_for_view=DhtAFkwAAAAJ:ALROH1vI_8AC) <strong><span class='show_paper_citations' data='DhtAFkwAAAAJ:ALROH1vI_8AC'></span></strong>-->
- This work investigates the relationship between viewing experience and various factors in Cinematic VR, and proposes an attention–comfort–understanding analysis paradigm to help creators better capture viewers' attention and enhance narrative comprehension.
- [[link]](https://doi.org/10.1109/ICME52920.2022.9859864) [[PDF]](/images/icme22.pdf)
</div>
</div>


# 🎥 Digital Arts
<div class='paper-box'><div class='paper-box-image'><div><div class="badge">Dome 2020</div><img src='images/500x300.png' alt="sym" width="100%"></div></div>
<div class='paper-box-text' markdown="1">

**the belief**

[**Video Presentation**](https://www.bilibili.com/video/BV1zj421d72z/) 
- Immersive Video &#124; Dome &#124; CGI Animation &#124; Notch &#124; Hecos
</div>
</div>

<div class='paper-box'><div class='paper-box-image'><div><div class="badge">Dome 2021</div><img src='images/500x300.png' alt="sym" width="100%"></div></div>
<div class='paper-box-text' markdown="1">

***BFA* in the Hemsiphere**

[**Video Presentation**](https://www.bilibili.com/video/BV1zj421d72z/) 
- Immersive Video &#124; Dome &#124; Timelapse Photography &#124; Color Grading &#124; Hecos
</div>
</div>

<div class='paper-box'><div class='paper-box-image'><div><div class="badge">Mapping 2020</div><img src='images/500x300.png' alt="sym" width="100%"></div></div>
<div class='paper-box-text' markdown="1">

**the globe can be a tower**

[**Video Presentation**](https://www.bilibili.com/video/BV1zj421d72z/) 
- Mapping &#124; CGI Animation &#124; C4D &#124; Hecos
- Inspired by the song of *Wutiaoren*.
</div>
</div>

<div class='paper-box'><div class='paper-box-image'><div><div class="badge">CGI Animation 2023</div><img src='images/500x300.png' alt="sym" width="100%"></div></div>
<div class='paper-box-text' markdown="1">

**the beginning**

[**Video Presentation**](https://www.bilibili.com/video/BV1Q2421P7oK/) 
- CGI Animation &#124; Unreal Engine &#124; Virtual Environment Lighting &#124; Shader
- Inspired by *Rurouni Kenshin: The Beginning*.
</div>
</div>

<div class='paper-box'><div class='paper-box-image'><div><div class="badge">Timelapse Photography 2019</div><img src='images/500x300.png' alt="sym" width="100%"></div></div>
<div class='paper-box-text' markdown="1">

**Metropolitan**

[**Video Presentation**](https://www.bilibili.com/video/BV1cm411C71Q/) 
- Timelapse Photography &#124; Color Grading &#124; Editing
</div>
</div>
