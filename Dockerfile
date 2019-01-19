FROM node:alpine AS yarninstall
RUN apk add yarn
RUN apk add git
RUN apk add python
WORKDIR /src/client
COPY client/package.json ./package.json
COPY client/yarn.lock ./yarn.lock
RUN yarn --pure-lockfile

FROM yarninstall AS copy_client_sources
WORKDIR /src/client
COPY client .
# copy git for version tag
WORKDIR /src
COPY .git .
COPY .gitignore .

FROM copy_client_sources AS ngbuild
WORKDIR /src/client
RUN yarn run build:production

FROM microsoft/dotnet:2.2-aspnetcore-runtime AS base
WORKDIR /app
EXPOSE 80

FROM microsoft/dotnet:2.2-sdk AS build
RUN git clone https://github.com/vcpsh/single-sign-on --branch master
WORKDIR /src
COPY sh.vcp.groupadministration/sh.vcp.groupadministration.csproj sh.vcp.groupadministration/
COPY sh.vcp.groupadministration.dal/sh.vcp.groupadministration.dal.csproj sh.vcp.groupadministration.dal/
RUN dotnet restore sh.vcp.groupadministration/sh.vcp.groupadministration.csproj
COPY . .
WORKDIR /src/sh.vcp.groupadministration
RUN dotnet build sh.vcp.groupadministration.csproj -c Release -o /app

FROM build AS publish
RUN dotnet publish sh.vcp.groupadministration.csproj -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
COPY --from=ngbuild /src/client/dist/client/ ./wwwroot/
ENTRYPOINT ["dotnet", "sh.vcp.groupadministration.dll"]
