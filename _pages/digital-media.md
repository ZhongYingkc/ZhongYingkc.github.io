---
permalink: /digital-media/
title: Digital Media
description: "Selected immersive art, projection mapping, CGI animation, timelapse, and photography works by Ying (Wing) Zhong."
author_profile: true
layout: default
---

{% include base_path %}

# DIGITAL MEDIA WORKS

Click the images to see their video presentation.

<div class='portfolio-box'><div class='portfolio-box-image'><div><div class="badge">Dome</div><a href="https://www.bilibili.com/video/BV1kJLTz2EsN/"><picture><source srcset="/images/bfahemisphere.webp" type="image/webp"><img src='/images/bfahemisphere.png' alt="BFA in the Hemisphere dome artwork" width="2400" height="1022" loading="lazy" decoding="async"></picture></a></div></div>
</div>

<div class='portfolio-box'><div class='portfolio-box-image'><div><div class="badge">Dome</div><a href="https://www.bilibili.com/video/BV1qhLTzuEMY/"><picture><source srcset="/images/thebelief.webp" type="image/webp"><img src='/images/thebelief.png' alt="The Belief immersive dome artwork" width="2400" height="1022" loading="lazy" decoding="async"></picture></a></div></div>
</div>

<div class='portfolio-box'><div class='portfolio-box-image'><div><div class="badge">Mapping</div><a href="https://www.bilibili.com/video/BV1zj421d72z/"><picture><source srcset="/images/globe.webp" type="image/webp"><img src='/images/globe.png' alt="Globe projection mapping artwork" width="2400" height="1022" loading="lazy" decoding="async"></picture></a></div></div>
</div>

<div class='portfolio-box'><div class='portfolio-box-image'><div><div class="badge">CGI Animation</div><a href="https://www.bilibili.com/video/BV1Q2421P7oK/"><picture><source srcset="/images/beginning.webp" type="image/webp"><img src='/images/beginning.png' alt="The Beginning CGI animation" width="2400" height="1022" loading="lazy" decoding="async"></picture></a></div></div>
</div>

<div class='portfolio-box'><div class='portfolio-box-image'><div><div class="badge">Timelapse Photography</div><a href="https://www.bilibili.com/video/BV1cm411C71Q/"><picture><source srcset="/images/metropolitan.webp" type="image/webp"><img src='/images/metropolitan.png' alt="Metropolitan timelapse photography" width="2400" height="1022" loading="lazy" decoding="async"></picture></a></div></div>
</div>

# PHOTOGRAPHY

Selected photographs from places I have lived in and passed through. Click an image to view it full size.

<div class="photography-gallery" aria-label="Photography gallery">
{% for photo in site.data.photography %}
  <figure class="photography-gallery__item">
    <a class="image-popup photography-gallery__link" href="{{ photo.image | relative_url }}" title="{{ photo.location }}" aria-label="View photograph from {{ photo.location }} full size">
      <img src="{{ photo.thumbnail | relative_url }}" alt="{{ photo.alt }}" width="{{ photo.width }}" height="{{ photo.height }}" loading="lazy" decoding="async">
      <figcaption class="photography-gallery__caption">{{ photo.location }}</figcaption>
    </a>
  </figure>
{% endfor %}
</div>
