#!/usr/bin/env bash
# Generates placeholder pages for EN (root) and KA (ka/) from each language's index.html,
# reusing its header, footer and <head> assets. Run from anywhere: bash tools/build-stubs.sh
set -euo pipefail
cd "$(dirname "$0")/.."

ICON='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M2 20h20M5 20V9l7-5 7 5v11"/><path d="M9 20v-6h6v6"/><path d="m3 4 3 3M21 4l-3 3"/></svg>'

# build LANG DIR ASSET_PREFIX OTHER_LANG OTHER_PREFIX SKIP HOME UNDER BACK CONTACT SUFFIX
build() {
  local lang=$1 dir=$2 ap=$3 olang=$4 oprefix=$5 skip=$6 home=$7 under=$8 back=$9 contact=${10} suffix=${11}
  local src="$dir/index.html"
  HEADER=$(sed -n '/<!--HEADER-->/,/<!--\/HEADER-->/p' "$src" | sed 's/class="header"/class="header header--solid"/')
  FOOTER=$(sed -n '/<!--FOOTER-->/,/<!--\/FOOTER-->/p' "$src")
  HEAD=$(sed -n '/<link rel="icon"/,/assets\/styles.css/p' "$src")
  shift 11
  while [ $# -ge 3 ]; do
    local f=$1 t=$2 d=$3; shift 3
    # current page highlight + language switcher pointing to the same page
    local h
    h=$(printf '%s' "$HEADER" \
      | sed "s|class=\"nav__link\" href=\"$f\"|class=\"nav__link\" href=\"$f\" aria-current=\"page\"|" \
      | sed "s|href=\"index.html\" lang=\"$lang\"|href=\"$f\" lang=\"$lang\"|" \
      | sed "s|href=\"${oprefix}index.html\" lang=\"$olang\"|href=\"${oprefix}$f\" lang=\"$olang\"|")
    cat > "$dir/$f" <<EOF
<!doctype html>
<html lang="$lang">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>$t — $suffix</title>
  <meta name="description" content="$t — $suffix">
  <meta name="theme-color" content="#1d1e31">
  <meta name="robots" content="noindex, nofollow">
$HEAD
  <link rel="alternate" hreflang="$olang" href="${oprefix}$f">
</head>
<body>
<a class="skip-link" href="#main">$skip</a>
$h
<main id="main">
  <section class="page-hero">
    <div class="container">
      <nav class="breadcrumbs" aria-label="Breadcrumbs"><a href="index.html">$home</a><span aria-hidden="true">/</span><span aria-current="page">$t</span></nav>
      <h1>$t</h1>
    </div>
  </section>
  <section class="section">
    <div class="container stub">
      <div class="stub__icon">$ICON</div>
      <h2>$under</h2>
      <p>$d</p>
      <div class="stub__actions">
        <a class="btn btn--primary" href="index.html">$back</a>
$( [ "$f" = contact.html ] || echo "        <a class=\"btn btn--outline\" href=\"contact.html\">$contact</a>" )
      </div>
    </div>
  </section>
</main>
$FOOTER
$( [ "$lang" = ka ] && echo "<div class=\"concept-badge\" role=\"note\">კონცეფციის პროტოტიპი — არ არის ოფიციალური საიტი</div>" || echo "<div class=\"concept-badge\" role=\"note\">Concept prototype — not the official website</div>" )
<script src="${ap}assets/main.js" defer></script>
</body>
</html>
EOF
  done
}

build en . "" ka "ka/" "Skip to content" "Home" "This page is under construction" "Back to home" "Contact us" "Metro Avrasya Georgia" \
  about.html "About us" "Company profile, mission, values, key figures and leadership will be published here." \
  history.html "Our history" "A timeline of the holding’s milestones since 2010 will be published here." \
  news.html "News" "The news feed with filters by company and date will be published here." \
  announcements.html "Announcements" "Tenders, vacancies and official announcements will be published here." \
  contact.html "Contact us" "A contact form, office map, phone numbers and e‑mail addresses will be published here." \
  projects.html "Projects" "Details of ongoing and completed projects of the holding will be published here." \
  management.html "Management" "Information about the board and management team will be published here." \
  careers.html "Careers" "Open positions across the holding’s companies will be published here." \
  privacy.html "Privacy policy" "The privacy and cookie policy will be published here."

build ka ka "../" en "../" "კონტენტზე გადასვლა" "მთავარი" "გვერდი მუშავდება" "მთავარზე დაბრუნება" "დაგვიკავშირდით" "მეტრო ავრასია საქართველო" \
  about.html "ჩვენ შესახებ" "აქ განთავსდება კომპანიის პროფილი, მისია, ღირებულებები, ძირითადი მაჩვენებლები და ხელმძღვანელობა." \
  history.html "ჩვენი ისტორია" "აქ განთავსდება ჰოლდინგის მნიშვნელოვანი ეტაპების ქრონოლოგია 2010 წლიდან." \
  news.html "სიახლეები" "აქ განთავსდება სიახლეების არხი კომპანიისა და თარიღის მიხედვით ფილტრებით." \
  announcements.html "განცხადებები" "აქ განთავსდება ტენდერები, ვაკანსიები და ოფიციალური განცხადებები." \
  contact.html "კონტაქტი" "აქ განთავსდება საკონტაქტო ფორმა, ოფისის რუკა, ტელეფონის ნომრები და ელფოსტის მისამართები." \
  projects.html "პროექტები" "აქ განთავსდება ჰოლდინგის მიმდინარე და დასრულებული პროექტების დეტალები." \
  management.html "მენეჯმენტი" "აქ განთავსდება ინფორმაცია სამეთვალყურეო საბჭოსა და მენეჯმენტის გუნდის შესახებ." \
  careers.html "კარიერა" "აქ განთავსდება ჰოლდინგის კომპანიების ღია ვაკანსიები." \
  privacy.html "კონფიდენციალურობის პოლიტიკა" "აქ განთავსდება კონფიდენციალურობისა და cookie-ფაილების პოლიტიკა."

echo "Stubs built."
