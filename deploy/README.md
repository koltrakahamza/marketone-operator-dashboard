# Hostimi dhe heqja e MarketOne

Ky konfigurim është specifik për serverin ekzistues. Për zhvillim lokal përdorni komandat npm në README kryesor.

## Izolimi

- Dosja: `/opt/fror/production/marketone-demo`.
- Compose project: `marketone-demo`; container: `marketone-demo-web-1`.
- Vetëm `dist/` dhe konfigurimi i vet Caddy montohen në container, vetëm për lexim.
- Portë lokale: `127.0.0.1:8094`; nuk ekspozohet drejtpërdrejt në internet.
- Kufij: 64 MB RAM dhe 0.25 CPU. Nuk krijohet databazë apo Docker volume persistent.
- Përdoret imazhi Caddy ekzistues. Lidhja me proxy-n bëhet në rrjetin ekzistues `kola-construction_kola`, i cili nuk hiqet nga ky projekt.
- Ndryshimi i vetëm jashtë dosjes është një bllok i shënuar për domenin MarketOne në `../Caddyfile`. Nuk ndryshohet kodi ose konfigurimi Compose i Construction.

## Publikimi

Nga kjo dosje:

```bash
npm ci
npm run build
docker compose up -d
python3 deploy/manage-hosting.py enable
```

Adresa e konfigurimit: `https://marketone.178-104-201-39.sslip.io`.

Script-i validon konfigurimin e ri përpara ndryshimit, ruan kopje në `deploy/local/`, ringarkon proxy-n pa rinisur aplikacionet dhe rikthen konfigurimin paraprak nëse ringarkimi dështon. Kopjet lokale përjashtohen nga Git dhe arkivi i dorëzimit.

Certifikata HTTPS menaxhohet nga proxy ekzistues. Certifikatat mund të mbeten në storage-in e përbashkët të proxy-t edhe pas çaktivizimit; ai storage nuk duhet fshirë sepse përdoret nga faqet e tjera.

## Çaktivizimi dhe heqja më vonë

Ekzekutoni fillimisht, brenda `marketone-demo`:

```bash
python3 deploy/manage-hosting.py disable
docker compose down
```

Më pas dosja `marketone-demo` mund të arkivohet ose fshihet e plotë. Mos e fshini dosjen përpara çaktivizimit të rrugës dhe ndalimit të container-it. Mos përdorni `docker system prune` ose mos fshini volume/rrjete të përbashkëta.

Nuk është konfiguruar cron apo fshirje automatike. Afati njëjavor është për përdorim të përkohshëm; çaktivizimi bëhet kur përdoruesi e kërkon.

## Shënim për mjetet e testimit në këtë server

Varësitë npm dhe mjetet e shkarkuara për këtë punë ruhen brenda `node_modules/` dhe `.cache/`, të përjashtuara nga Git. Shfletuesi i testimit përdor disa biblioteka ekzistuese nga `/tmp/kola-pm-libs` vetëm për lexim; ato nuk janë varësi e faqes së publikuar dhe nuk duhen fshirë bashkë me MarketOne.
