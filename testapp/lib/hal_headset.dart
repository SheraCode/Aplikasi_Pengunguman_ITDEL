import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:async';
import 'dart:convert';

void main() {
  runApp(MaterialApp(
    home: Home(),
  ));
}

class Home extends StatefulWidget {
  const Home({Key? key});

  @override
  State<Home> createState() => _HomeState();
}

class _HomeState extends State<Home> {
  Future<List> ambildata() async {
    final response = await http.get(
      Uri.parse("http://192.168.134.1:3000/api/v1/students/perpustakaan"),
      headers: {"Accept": "application/json"},
    );

    if (response.statusCode == 200) {
      return json.decode(response.body)['perpustakaan'];
    } else {
      throw Exception('Gagal memuat dataa'); // Melempar pengecualian jika ada kesalahan.
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: FutureBuilder<List>(
        future: ambildata(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text('Gagal memuat dataaa'));
          } else if (snapshot.hasData) {
            List dataJSON = snapshot.data!;

            return ListView.builder(
              itemCount: dataJSON.length,
              itemBuilder: (context, i) => Card(
                child: Column(
                  children: <Widget>[
                    Center(
                      child: Text(
                        dataJSON[i]['title'],
                        style: TextStyle(
                          fontSize: 23.0,
                          foreground: Paint()
                            ..style = PaintingStyle.stroke
                            ..strokeWidth = 2
                            ..color = Colors.blue[500]!,
                        ),
                      ),
                    ),
                    Image(
                      image: NetworkImage("http://192.168.134.1:3000/api/v1/${dataJSON[i]['thumbnial']}"),
                      width: 150.0,
                    ),
                    Text(
                      dataJSON[i]['description'],
                      style: TextStyle(fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
              ),
            );
          } else {
            return Center(child: Text('Gagal memuat data q'));
          }
        },
      ),
    );
  }
}
