# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e.spec.ts >> Nuria Forest Platform End-to-End >> Storefront Navigation & Search
- Location: tests/e2e.spec.ts:5:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByPlaceholder('Search books, authors, ISBN...')

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - region "Notifications (F8)":
    - list
  - region "Notifications alt+T"
  - generic [ref=e3]:
    - generic [ref=e5]:
      - generic [ref=e6]: 🚚 Enjoy free delivery within Nairobi for orders above KSh 10,000 | 📞 0794 233 261
      - button "Dismiss" [ref=e7] [cursor=pointer]:
        - img [ref=e8]
    - banner [ref=e11]:
      - generic [ref=e12]:
        - link "Nuria Logo" [ref=e14] [cursor=pointer]:
          - /url: /
          - img "Nuria Logo" [ref=e15]
        - generic [ref=e16]:
          - navigation [ref=e17]:
            - link "Home" [ref=e18] [cursor=pointer]:
              - /url: /
            - link "Shop" [ref=e19] [cursor=pointer]:
              - /url: /books
            - link "Gift Card" [ref=e20] [cursor=pointer]:
              - /url: /gift-card
            - link "Blog" [ref=e21] [cursor=pointer]:
              - /url: /blog
            - link "About Us" [ref=e22] [cursor=pointer]:
              - /url: /about
          - generic [ref=e23]:
            - link "SELL ON NURIA" [ref=e24] [cursor=pointer]:
              - /url: /vendor/guide
              - button "SELL ON NURIA" [ref=e25]
            - link "VENDOR LOGIN" [ref=e26] [cursor=pointer]:
              - /url: /vendor
              - button "VENDOR LOGIN" [ref=e27]
          - link "Wishlist" [ref=e28] [cursor=pointer]:
            - /url: /wishlist
            - img [ref=e29]
          - link "Cart" [ref=e31] [cursor=pointer]:
            - /url: /cart
            - img [ref=e32]
          - link "Sign in" [ref=e36] [cursor=pointer]:
            - /url: /login
            - img [ref=e37]
    - main [ref=e40]:
      - main [ref=e41]:
        - generic [ref=e42]:
          - region [ref=e43]:
            - generic [ref=e45]:
              - group [ref=e46]:
                - generic [ref=e47]:
                  - img "New Arrivals" [ref=e48]
                  - generic [ref=e51]:
                    - heading "New Arrivals" [level=1] [ref=e52]
                    - paragraph [ref=e53]: Discover the latest titles added to our collection this week.
                    - link "Shop New Releases" [ref=e54] [cursor=pointer]:
                      - /url: /books?sort=newest
                      - button "Shop New Releases" [ref=e55]:
                        - text: Shop New Releases
                        - img
              - group [ref=e56]:
                - generic [ref=e57]:
                  - img "Kenyan Classics" [ref=e58]
                  - generic [ref=e61]:
                    - heading "Kenyan Classics" [level=1] [ref=e62]
                    - paragraph [ref=e63]: Explore timeless works from Kenya's most celebrated authors.
                    - link "Explore Local Literature" [ref=e64] [cursor=pointer]:
                      - /url: /books?category=african-literature
                      - button "Explore Local Literature" [ref=e65]:
                        - text: Explore Local Literature
                        - img
              - group [ref=e66]:
                - generic [ref=e67]:
                  - img "Children's Corner" [ref=e68]
                  - generic [ref=e71]:
                    - heading "Children's Corner" [level=1] [ref=e72]
                    - paragraph [ref=e73]: Nurturing young minds with stories that inspire and educate.
                    - link "Browse Children's Books" [ref=e74] [cursor=pointer]:
                      - /url: /books?category=children
                      - button "Browse Children's Books" [ref=e75]:
                        - text: Browse Children's Books
                        - img
              - group [ref=e76]:
                - generic [ref=e77]:
                  - img "Academic Excellence" [ref=e78]
                  - generic [ref=e81]:
                    - heading "Academic Excellence" [level=1] [ref=e82]
                    - paragraph [ref=e83]: Primary, secondary, and tertiary resources for every learner.
                    - link "Shop Academic Texts" [ref=e84] [cursor=pointer]:
                      - /url: /books?category=education
                      - button "Shop Academic Texts" [ref=e85]:
                        - text: Shop Academic Texts
                        - img
              - group [ref=e86]:
                - generic [ref=e87]:
                  - img "Gifts of Knowledge" [ref=e88]
                  - generic [ref=e91]:
                    - heading "Gifts of Knowledge" [level=1] [ref=e92]
                    - paragraph [ref=e93]: Give the gift of reading with our premium gift card collection.
                    - link "Buy A Gift Card" [ref=e94] [cursor=pointer]:
                      - /url: /gift-card
                      - button "Buy A Gift Card" [ref=e95]:
                        - text: Buy A Gift Card
                        - img
            - button "Previous slide" [ref=e96] [cursor=pointer]:
              - img
              - generic [ref=e97]: Previous slide
            - button "Next slide" [ref=e98] [cursor=pointer]:
              - img
              - generic [ref=e99]: Next slide
          - generic [ref=e101]:
            - generic:
              - img
            - textbox "Search 21,000+ Titles, Authors, Genres..." [ref=e102]
            - button "SEARCH" [ref=e103] [cursor=pointer]
        - generic [ref=e104]:
          - generic [ref=e105]:
            - generic [ref=e106]:
              - text: DISCOVER
              - heading "Shop by Category" [level=2] [ref=e107]
            - link "View All" [ref=e109] [cursor=pointer]:
              - /url: /books
              - text: View All
              - img [ref=e110]
          - generic [ref=e112]:
            - link "Fiction" [ref=e113] [cursor=pointer]:
              - /url: /books?category=fiction
              - img [ref=e115]
              - generic [ref=e117]: Fiction
            - link "Non-Fiction" [ref=e118] [cursor=pointer]:
              - /url: /books?category=non-fiction
              - img [ref=e120]
              - generic [ref=e123]: Non-Fiction
            - link "Children" [ref=e124] [cursor=pointer]:
              - /url: /books?category=children
              - img [ref=e126]
              - generic [ref=e129]: Children
            - link "Education" [ref=e130] [cursor=pointer]:
              - /url: /books?category=education
              - img [ref=e132]
              - generic [ref=e135]: Education
            - link "Self-Help" [ref=e136] [cursor=pointer]:
              - /url: /books?category=self-help
              - img [ref=e138]
              - generic [ref=e140]: Self-Help
            - link "Religion" [ref=e141] [cursor=pointer]:
              - /url: /books?category=religion
              - img [ref=e143]
              - generic [ref=e145]: Religion
            - link "Business" [ref=e146] [cursor=pointer]:
              - /url: /books?category=business
              - img [ref=e148]
              - generic [ref=e151]: Business
            - link "History" [ref=e152] [cursor=pointer]:
              - /url: /books?category=history
              - img [ref=e154]
              - generic [ref=e157]: History
            - link "Technology" [ref=e158] [cursor=pointer]:
              - /url: /books?category=technology
              - img [ref=e160]
              - generic [ref=e162]: Technology
            - link "Lifestyle" [ref=e163] [cursor=pointer]:
              - /url: /books?category=lifestyle
              - img [ref=e165]
              - generic [ref=e167]: Lifestyle
        - generic [ref=e168]:
          - generic [ref=e169]:
            - generic [ref=e170]:
              - text: CURATED
              - heading "Featured Titles" [level=2] [ref=e171]
            - link "See All" [ref=e173] [cursor=pointer]:
              - /url: /books?featured=true
              - text: See All
              - img [ref=e174]
          - generic [ref=e176]:
            - generic [ref=e177]:
              - link "Animal Farm -7% Add to wishlist" [ref=e178] [cursor=pointer]:
                - /url: /books/animal-farm-by-george-orwell
                - img "Animal Farm" [ref=e179]
                - generic [ref=e180]: "-7%"
                - button "Add to wishlist" [ref=e181]:
                  - img [ref=e182]
              - generic [ref=e184]:
                - link "Animal Farm George Orwell Ksh 1,490 Ksh 1,600" [ref=e185] [cursor=pointer]:
                  - /url: /books/animal-farm-by-george-orwell
                  - heading "Animal Farm" [level=3] [ref=e186]
                  - paragraph [ref=e187]: George Orwell
                  - generic [ref=e188]:
                    - generic [ref=e189]: Ksh 1,490
                    - generic [ref=e190]: Ksh 1,600
                - button "Add to Cart" [ref=e191] [cursor=pointer]:
                  - img [ref=e192]
                  - text: Add to Cart
            - generic [ref=e196]:
              - link "Dust -16% Add to wishlist" [ref=e197] [cursor=pointer]:
                - /url: /books/dust-by-yvonne-adhiambo-owuor
                - img "Dust" [ref=e198]
                - generic [ref=e199]: "-16%"
                - button "Add to wishlist" [ref=e200]:
                  - img [ref=e201]
              - generic [ref=e203]:
                - link "Dust Yvonne Adhiambo Owuor Ksh 2,090 Ksh 2,500" [ref=e204] [cursor=pointer]:
                  - /url: /books/dust-by-yvonne-adhiambo-owuor
                  - heading "Dust" [level=3] [ref=e205]
                  - paragraph [ref=e206]: Yvonne Adhiambo Owuor
                  - generic [ref=e207]:
                    - generic [ref=e208]: Ksh 2,090
                    - generic [ref=e209]: Ksh 2,500
                - button "Add to Cart" [ref=e210] [cursor=pointer]:
                  - img [ref=e211]
                  - text: Add to Cart
            - generic [ref=e215]:
              - link "The Book Of Dust -5% Add to wishlist" [ref=e216] [cursor=pointer]:
                - /url: /books/the-book-of-dust
                - img "The Book Of Dust" [ref=e217]
                - generic [ref=e218]: "-5%"
                - button "Add to wishlist" [ref=e219]:
                  - img [ref=e220]
              - generic [ref=e222]:
                - link "The Book Of Dust Nuria Author Ksh 1,516 Ksh 1,595" [ref=e223] [cursor=pointer]:
                  - /url: /books/the-book-of-dust
                  - heading "The Book Of Dust" [level=3] [ref=e224]
                  - paragraph [ref=e225]: Nuria Author
                  - generic [ref=e226]:
                    - generic [ref=e227]: Ksh 1,516
                    - generic [ref=e228]: Ksh 1,595
                - button "Add to Cart" [ref=e229] [cursor=pointer]:
                  - img [ref=e230]
                  - text: Add to Cart
            - generic [ref=e234]:
              - link "Born A Crime -11% Add to wishlist" [ref=e235] [cursor=pointer]:
                - /url: /books/born-a-crime-by-trevor-noah-paperback
                - img "Born A Crime" [ref=e236]
                - generic [ref=e237]: "-11%"
                - button "Add to wishlist" [ref=e238]:
                  - img [ref=e239]
              - generic [ref=e241]:
                - link "Born A Crime Trevor Noah Paperback Ksh 1,790 Ksh 2,000" [ref=e242] [cursor=pointer]:
                  - /url: /books/born-a-crime-by-trevor-noah-paperback
                  - heading "Born A Crime" [level=3] [ref=e243]
                  - paragraph [ref=e244]: Trevor Noah Paperback
                  - generic [ref=e245]:
                    - generic [ref=e246]: Ksh 1,790
                    - generic [ref=e247]: Ksh 2,000
                - button "Add to Cart" [ref=e248] [cursor=pointer]:
                  - img [ref=e249]
                  - text: Add to Cart
            - generic [ref=e253]:
              - link "The Return Of The Primitive The Anti Industrial Revolution -5% Add to wishlist" [ref=e254] [cursor=pointer]:
                - /url: /books/the-return-of-the-primitive-the-anti-industrial-revolution
                - img "The Return Of The Primitive The Anti Industrial Revolution" [ref=e255]
                - generic [ref=e256]: "-5%"
                - button "Add to wishlist" [ref=e257]:
                  - img [ref=e258]
              - generic [ref=e260]:
                - link "The Return Of The Primitive The Anti Industrial Revolution Nuria Author Ksh 1,330 Ksh 1,399" [ref=e261] [cursor=pointer]:
                  - /url: /books/the-return-of-the-primitive-the-anti-industrial-revolution
                  - heading "The Return Of The Primitive The Anti Industrial Revolution" [level=3] [ref=e262]
                  - paragraph [ref=e263]: Nuria Author
                  - generic [ref=e264]:
                    - generic [ref=e265]: Ksh 1,330
                    - generic [ref=e266]: Ksh 1,399
                - button "Add to Cart" [ref=e267] [cursor=pointer]:
                  - img [ref=e268]
                  - text: Add to Cart
            - generic [ref=e272]:
              - link "The Fourth Industrial Revolution -17% Add to wishlist" [ref=e273] [cursor=pointer]:
                - /url: /books/the-fourth-industrial-revolution-by-klaus-schwab
                - img "The Fourth Industrial Revolution" [ref=e274]
                - generic [ref=e275]: "-17%"
                - button "Add to wishlist" [ref=e276]:
                  - img [ref=e277]
              - generic [ref=e279]:
                - link "The Fourth Industrial Revolution Klaus Schwab Ksh 2,890 Ksh 3,500" [ref=e280] [cursor=pointer]:
                  - /url: /books/the-fourth-industrial-revolution-by-klaus-schwab
                  - heading "The Fourth Industrial Revolution" [level=3] [ref=e281]
                  - paragraph [ref=e282]: Klaus Schwab
                  - generic [ref=e283]:
                    - generic [ref=e284]: Ksh 2,890
                    - generic [ref=e285]: Ksh 3,500
                - button "Add to Cart" [ref=e286] [cursor=pointer]:
                  - img [ref=e287]
                  - text: Add to Cart
            - generic [ref=e291]:
              - link "The Pearl That Broke Its Shell -5% Add to wishlist" [ref=e292] [cursor=pointer]:
                - /url: /books/the-pearl-that-broke-its-shell
                - img "The Pearl That Broke Its Shell" [ref=e293]
                - generic [ref=e294]: "-5%"
                - button "Add to wishlist" [ref=e295]:
                  - img [ref=e296]
              - generic [ref=e298]:
                - link "The Pearl That Broke Its Shell Nuria Author Ksh 1,710 Ksh 1,799" [ref=e299] [cursor=pointer]:
                  - /url: /books/the-pearl-that-broke-its-shell
                  - heading "The Pearl That Broke Its Shell" [level=3] [ref=e300]
                  - paragraph [ref=e301]: Nuria Author
                  - generic [ref=e302]:
                    - generic [ref=e303]: Ksh 1,710
                    - generic [ref=e304]: Ksh 1,799
                - button "Add to Cart" [ref=e305] [cursor=pointer]:
                  - img [ref=e306]
                  - text: Add to Cart
            - generic [ref=e310]:
              - link "Our Memory Like Dust -5% Add to wishlist" [ref=e311] [cursor=pointer]:
                - /url: /books/our-memory-like-dust-by-gavin-chait
                - img "Our Memory Like Dust" [ref=e312]
                - generic [ref=e313]: "-5%"
                - button "Add to wishlist" [ref=e314]:
                  - img [ref=e315]
              - generic [ref=e317]:
                - link "Our Memory Like Dust Gavin Chait Ksh 1,425 Ksh 1,499" [ref=e318] [cursor=pointer]:
                  - /url: /books/our-memory-like-dust-by-gavin-chait
                  - heading "Our Memory Like Dust" [level=3] [ref=e319]
                  - paragraph [ref=e320]: Gavin Chait
                  - generic [ref=e321]:
                    - generic [ref=e322]: Ksh 1,425
                    - generic [ref=e323]: Ksh 1,499
                - button "Add to Cart" [ref=e324] [cursor=pointer]:
                  - img [ref=e325]
                  - text: Add to Cart
        - generic [ref=e330]:
          - generic [ref=e331]:
            - generic [ref=e332]: Supporting Our Own
            - heading "Local Authors Spotlight" [level=2] [ref=e333]:
              - text: Local Authors
              - text: Spotlight
          - generic [ref=e335]:
            - link "Chimamanda Ngozi Adichie Chimamanda Ngozi Adichie Read Profile" [ref=e336] [cursor=pointer]:
              - /url: /author/chimamanda
              - img "Chimamanda Ngozi Adichie" [ref=e338]
              - generic [ref=e340]:
                - heading "Chimamanda Ngozi Adichie" [level=3] [ref=e341]
                - generic [ref=e342]:
                  - text: Read Profile
                  - img [ref=e343]
            - link "Chinua Achebe Chinua Achebe Read Profile" [ref=e345] [cursor=pointer]:
              - /url: /author/chinua-achebe
              - img "Chinua Achebe" [ref=e347]
              - generic [ref=e349]:
                - heading "Chinua Achebe" [level=3] [ref=e350]
                - generic [ref=e351]:
                  - text: Read Profile
                  - img [ref=e352]
            - link "Ngũgĩ wa Thiong'o Ngũgĩ wa Thiong'o Read Profile" [ref=e354] [cursor=pointer]:
              - /url: /author/ngugi
              - img "Ngũgĩ wa Thiong'o" [ref=e356]
              - generic [ref=e358]:
                - heading "Ngũgĩ wa Thiong'o" [level=3] [ref=e359]
                - generic [ref=e360]:
                  - text: Read Profile
                  - img [ref=e361]
            - link "Wangari Maathai Wangari Maathai Read Profile" [ref=e363] [cursor=pointer]:
              - /url: /author/wangari-maathai
              - img "Wangari Maathai" [ref=e365]
              - generic [ref=e367]:
                - heading "Wangari Maathai" [level=3] [ref=e368]
                - generic [ref=e369]:
                  - text: Read Profile
                  - img [ref=e370]
        - generic [ref=e372]:
          - generic [ref=e373]:
            - generic [ref=e374]:
              - text: LATEST
              - heading "New Arrivals" [level=2] [ref=e375]
            - link "View All" [ref=e377] [cursor=pointer]:
              - /url: /books
              - text: View All
              - img [ref=e378]
          - generic [ref=e380]:
            - generic [ref=e381]:
              - link "How To Be Both A Novel -18% Add to wishlist" [ref=e382] [cursor=pointer]:
                - /url: /books/how-to-be-both-a-novel-by-ali-smith
                - img "How To Be Both A Novel" [ref=e383]
                - generic [ref=e384]: "-18%"
                - button "Add to wishlist" [ref=e385]:
                  - img [ref=e386]
              - generic [ref=e388]:
                - link "How To Be Both A Novel Ali Smith Ksh 1,390 Ksh 1,690" [ref=e389] [cursor=pointer]:
                  - /url: /books/how-to-be-both-a-novel-by-ali-smith
                  - heading "How To Be Both A Novel" [level=3] [ref=e390]
                  - paragraph [ref=e391]: Ali Smith
                  - generic [ref=e392]:
                    - generic [ref=e393]: Ksh 1,390
                    - generic [ref=e394]: Ksh 1,690
                - button "Add to Cart" [ref=e395] [cursor=pointer]:
                  - img [ref=e396]
                  - text: Add to Cart
            - generic [ref=e400]:
              - link "Flood Of Fire -5% Add to wishlist" [ref=e401] [cursor=pointer]:
                - /url: /books/flood-of-fire
                - img "Flood Of Fire" [ref=e402]
                - generic [ref=e403]: "-5%"
                - button "Add to wishlist" [ref=e404]:
                  - img [ref=e405]
              - generic [ref=e407]:
                - link "Flood Of Fire Nuria Author Ksh 1,231 Ksh 1,295" [ref=e408] [cursor=pointer]:
                  - /url: /books/flood-of-fire
                  - heading "Flood Of Fire" [level=3] [ref=e409]
                  - paragraph [ref=e410]: Nuria Author
                  - generic [ref=e411]:
                    - generic [ref=e412]: Ksh 1,231
                    - generic [ref=e413]: Ksh 1,295
                - button "Add to Cart" [ref=e414] [cursor=pointer]:
                  - img [ref=e415]
                  - text: Add to Cart
            - generic [ref=e419]:
              - link "Dear Ijeawele Or A Feminist Manifesto In Fifteen Suggestions -11% Add to wishlist" [ref=e420] [cursor=pointer]:
                - /url: /books/dear-ijeawele-or-a-feminist-manifesto-in-fifteen-suggestions
                - img "Dear Ijeawele Or A Feminist Manifesto In Fifteen Suggestions" [ref=e421]
                - generic [ref=e422]: "-11%"
                - button "Add to wishlist" [ref=e423]:
                  - img [ref=e424]
              - generic [ref=e426]:
                - link "Dear Ijeawele Or A Feminist Manifesto In Fifteen Suggestions Nuria Author Ksh 890 Ksh 1,000" [ref=e427] [cursor=pointer]:
                  - /url: /books/dear-ijeawele-or-a-feminist-manifesto-in-fifteen-suggestions
                  - heading "Dear Ijeawele Or A Feminist Manifesto In Fifteen Suggestions" [level=3] [ref=e428]
                  - paragraph [ref=e429]: Nuria Author
                  - generic [ref=e430]:
                    - generic [ref=e431]: Ksh 890
                    - generic [ref=e432]: Ksh 1,000
                - button "Add to Cart" [ref=e433] [cursor=pointer]:
                  - img [ref=e434]
                  - text: Add to Cart
            - generic [ref=e438]:
              - link "Across The Bridge -10% Add to wishlist" [ref=e439] [cursor=pointer]:
                - /url: /books/across-the-bridge
                - img "Across The Bridge" [ref=e440]
                - generic [ref=e441]: "-10%"
                - button "Add to wishlist" [ref=e442]:
                  - img [ref=e443]
              - generic [ref=e445]:
                - link "Across The Bridge Nuria Author Ksh 890 Ksh 990" [ref=e446] [cursor=pointer]:
                  - /url: /books/across-the-bridge
                  - heading "Across The Bridge" [level=3] [ref=e447]
                  - paragraph [ref=e448]: Nuria Author
                  - generic [ref=e449]:
                    - generic [ref=e450]: Ksh 890
                    - generic [ref=e451]: Ksh 990
                - button "Add to Cart" [ref=e452] [cursor=pointer]:
                  - img [ref=e453]
                  - text: Add to Cart
            - generic [ref=e457]:
              - link "Land Without Thunder And Other Short Stories -5% Add to wishlist" [ref=e458] [cursor=pointer]:
                - /url: /books/land-without-thunder-and-other-short-stories
                - img "Land Without Thunder And Other Short Stories" [ref=e459]
                - generic [ref=e460]: "-5%"
                - button "Add to wishlist" [ref=e461]:
                  - img [ref=e462]
              - generic [ref=e464]:
                - link "Land Without Thunder And Other Short Stories Nuria Author Ksh 665 Ksh 699" [ref=e465] [cursor=pointer]:
                  - /url: /books/land-without-thunder-and-other-short-stories
                  - heading "Land Without Thunder And Other Short Stories" [level=3] [ref=e466]
                  - paragraph [ref=e467]: Nuria Author
                  - generic [ref=e468]:
                    - generic [ref=e469]: Ksh 665
                    - generic [ref=e470]: Ksh 699
                - button "Add to Cart" [ref=e471] [cursor=pointer]:
                  - img [ref=e472]
                  - text: Add to Cart
            - generic [ref=e476]:
              - link "The Day Of The Storm -5% Add to wishlist" [ref=e477] [cursor=pointer]:
                - /url: /books/the-day-of-the-storm
                - img "The Day Of The Storm" [ref=e478]
                - generic [ref=e479]: "-5%"
                - button "Add to wishlist" [ref=e480]:
                  - img [ref=e481]
              - generic [ref=e483]:
                - link "The Day Of The Storm Nuria Author Ksh 471 Ksh 495" [ref=e484] [cursor=pointer]:
                  - /url: /books/the-day-of-the-storm
                  - heading "The Day Of The Storm" [level=3] [ref=e485]
                  - paragraph [ref=e486]: Nuria Author
                  - generic [ref=e487]:
                    - generic [ref=e488]: Ksh 471
                    - generic [ref=e489]: Ksh 495
                - button "Add to Cart" [ref=e490] [cursor=pointer]:
                  - img [ref=e491]
                  - text: Add to Cart
            - generic [ref=e495]:
              - link "Diamonds Gold And War The British The Boers And The Making Of South Africa -5% Add to wishlist" [ref=e496] [cursor=pointer]:
                - /url: /books/diamonds-gold-and-war-the-british-the-boers-and-the-making-of-south-africa
                - img "Diamonds Gold And War The British The Boers And The Making Of South Africa" [ref=e497]
                - generic [ref=e498]: "-5%"
                - button "Add to wishlist" [ref=e499]:
                  - img [ref=e500]
              - generic [ref=e502]:
                - link "Diamonds Gold And War The British The Boers And The Making Of South Africa Nuria Author Ksh 1,520 Ksh 1,599" [ref=e503] [cursor=pointer]:
                  - /url: /books/diamonds-gold-and-war-the-british-the-boers-and-the-making-of-south-africa
                  - heading "Diamonds Gold And War The British The Boers And The Making Of South Africa" [level=3] [ref=e504]
                  - paragraph [ref=e505]: Nuria Author
                  - generic [ref=e506]:
                    - generic [ref=e507]: Ksh 1,520
                    - generic [ref=e508]: Ksh 1,599
                - button "Add to Cart" [ref=e509] [cursor=pointer]:
                  - img [ref=e510]
                  - text: Add to Cart
            - generic [ref=e514]:
              - link "Fan Into Flame -8% Add to wishlist" [ref=e515] [cursor=pointer]:
                - /url: /books/fan-into-flame-by-john-gatu
                - img "Fan Into Flame" [ref=e516]
                - generic [ref=e517]: "-8%"
                - button "Add to wishlist" [ref=e518]:
                  - img [ref=e519]
              - generic [ref=e521]:
                - link "Fan Into Flame John Gatu Ksh 2,290 Ksh 2,500" [ref=e522] [cursor=pointer]:
                  - /url: /books/fan-into-flame-by-john-gatu
                  - heading "Fan Into Flame" [level=3] [ref=e523]
                  - paragraph [ref=e524]: John Gatu
                  - generic [ref=e525]:
                    - generic [ref=e526]: Ksh 2,290
                    - generic [ref=e527]: Ksh 2,500
                - button "Add to Cart" [ref=e528] [cursor=pointer]:
                  - img [ref=e529]
                  - text: Add to Cart
        - generic [ref=e534]:
          - generic [ref=e535]:
            - heading "Are you an Author or Publisher?" [level=2] [ref=e536]
            - paragraph [ref=e537]: Join Kenya's fastest-growing online bookstore. Reach thousands of readers across the country and manage your sales with our transparent vendor dashboard.
          - link "Start Selling" [ref=e539] [cursor=pointer]:
            - /url: /vendor/guide
            - text: Start Selling
            - img [ref=e540]
    - contentinfo [ref=e542]:
      - generic [ref=e543]:
        - generic [ref=e544]:
          - generic [ref=e545]:
            - heading "TALK TO US" [level=4] [ref=e546]
            - list [ref=e547]:
              - listitem [ref=e548]:
                - img [ref=e549]
                - generic [ref=e551]: 0794 233261 / 0724 670194
              - listitem [ref=e552]:
                - img [ref=e553]
                - generic [ref=e556]: nuriakenyabookstore@gmail.com
              - listitem [ref=e557]:
                - img [ref=e558]
                - generic [ref=e561]: The Bazaar Building, 1st Floor
          - generic [ref=e562]:
            - heading "About Nuria" [level=4] [ref=e563]
            - list [ref=e564]:
              - listitem [ref=e565]:
                - link "Our Story" [ref=e566] [cursor=pointer]:
                  - /url: /about
              - listitem [ref=e567]:
                - link "Blog" [ref=e568] [cursor=pointer]:
                  - /url: /blog
              - listitem [ref=e569]:
                - link "Contact Us" [ref=e570] [cursor=pointer]:
                  - /url: /contact
          - generic [ref=e571]:
            - heading "VENDORS" [level=4] [ref=e572]
            - list [ref=e573]:
              - listitem [ref=e574]:
                - link "Sell on Nuria" [ref=e575] [cursor=pointer]:
                  - /url: /vendor/guide
              - listitem [ref=e576]:
                - link "Vendor Login" [ref=e577] [cursor=pointer]:
                  - /url: /login
              - listitem [ref=e578]:
                - link "Privacy Policy" [ref=e579] [cursor=pointer]:
                  - /url: /privacy
          - generic [ref=e580]:
            - heading "USEFUL LINKS" [level=4] [ref=e581]
            - list [ref=e582]:
              - listitem [ref=e583]:
                - link "Delivery Policy" [ref=e584] [cursor=pointer]:
                  - /url: /delivery
              - listitem [ref=e585]:
                - link "Returns" [ref=e586] [cursor=pointer]:
                  - /url: /returns
              - listitem [ref=e587]:
                - link "Gift Card Balance" [ref=e588] [cursor=pointer]:
                  - /url: /gift-card
        - generic [ref=e589]:
          - generic [ref=e590]:
            - generic [ref=e591]: We Accept
            - generic [ref=e592]:
              - generic [ref=e593]: M-Pesa
              - generic [ref=e594]: VISA
              - generic [ref=e595]: PesaPal
              - generic [ref=e596]: Bitcoin
          - generic [ref=e597]:
            - generic [ref=e598]: Follow Us
            - generic [ref=e599]:
              - link "Facebook" [ref=e600] [cursor=pointer]:
                - /url: https://facebook.com/nuriayourhonestonlineshop/
                - img [ref=e601]
              - link "Instagram" [ref=e603] [cursor=pointer]:
                - /url: https://instagram.com/nuria_thehoneststore/
                - img [ref=e604]
              - link "Twitter" [ref=e607] [cursor=pointer]:
                - /url: https://x.com/nuriastore
                - img [ref=e608]
        - paragraph [ref=e612]: © 2025 Nuria Kenya. All rights reserved. The Honest Store.
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Nuria Forest Platform End-to-End', () => {
  4  |   
  5  |   test('Storefront Navigation & Search', async ({ page }) => {
  6  |     await page.goto('/');
  7  |     
  8  |     // Check Branding/Title
  9  |     await expect(page).toHaveTitle(/Nuria/);
  10 |     
  11 |     // Test Search
  12 |     const searchInput = page.getByPlaceholder('Search books, authors, ISBN...');
> 13 |     await searchInput.fill('Kenya');
     |                       ^ Error: locator.fill: Test timeout of 30000ms exceeded.
  14 |     await searchInput.press('Enter');
  15 |     
  16 |     // Verify search results page
  17 |     await expect(page).toHaveURL(/.*search=Kenya/);
  18 |   });
  19 | 
  20 |   test('Cart Flow', async ({ page }) => {
  21 |     await page.goto('/books');
  22 |     
  23 |     // Wait for books to load
  24 |     await page.waitForSelector('button:has-text("Add to Cart")', { timeout: 15000 });
  25 |     
  26 |     // Add first book to cart
  27 |     const firstBook = page.locator('button:has-text("Add to Cart")').first();
  28 |     await firstBook.click();
  29 |     
  30 |     // Go to cart
  31 |     await page.goto('/cart');
  32 |     await expect(page.locator('text=Shopping Cart')).toBeVisible();
  33 |   });
  34 | 
  35 |   test('Admin Login & Dashboard Access', async ({ page }) => {
  36 |     await page.goto('/admin/login');
  37 |     
  38 |     // Login as Admin
  39 |     await page.locator('input[type="email"]').fill('admin@nuria.com');
  40 |     await page.locator('input[type="password"]').fill('nuria1234');
  41 |     await page.click('button:has-text("Sign In")');
  42 |     
  43 |     // Should be on Admin Dashboard
  44 |     await expect(page).toHaveURL(/.*admin/, { timeout: 15000 });
  45 |     await expect(page.locator('text=Admin Dashboard')).toBeVisible();
  46 |   });
  47 | 
  48 |   test('Vendor Registration & Guide', async ({ page }) => {
  49 |     await page.goto('/vendor/guide');
  50 |     
  51 |     // Click Register Button
  52 |     const registerBtn = page.getByRole('button', { name: 'Register as Vendor' });
  53 |     await registerBtn.click();
  54 |     
  55 |     // Should be on Registration Page
  56 |     await expect(page).toHaveURL(/.*vendor\/register/);
  57 |   });
  58 | 
  59 | });
  60 | 
```