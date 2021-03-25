# Contribute
```bash
# docker should be installed
docker build -t trailmix -f .docker/Dockerfile .

# now run tests
docker run trailmix deno test --unstable --allow-read --allow-env --import-map=import_map.json
```